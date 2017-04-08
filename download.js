var fs = require('fs');

var casper = require('casper').create({
    verbose: false,
    logLevel: 'info',
    viewportSize: {
        width: 800,
        height: 500
    }
});

function getDate() {
    return new Date().toISOString().replace(/[^0-9]/g, '');
}

function writeToFile(lines, filePath) {
    try {
        fs.write(filePath, lines.join("\n"), 'w');
    } catch (err) {
        this.log("Failed to save invoices.tsv; please check permissions", "error");
        this.log(err, "debug");
    }
}

casper.start('https://entre.stofast.se');

// Get command-line arguments:
var username = casper.cli.options.username;
var password = casper.cli.options.password;
var outputFolder = casper.cli.options.directory || ".";
var year = casper.cli.options.year || new Date().getFullYear();

/**
 * Initialise some logging. Useful in case errors need to be debugged.
 */

//casper.on("popup.loaded", function (newPage) {
//    console.log("Loaded " + newPage.url + " in popup window.");
//});

casper.on('error', function (msg, backtrace) {
    this.echo("=========================");
    this.echo("ERROR:");
    this.echo(msg);
    this.echo(backtrace);
    this.echo("=========================");
});

casper.on("page.error", function (msg, backtrace) {
    this.echo("=========================");
    this.echo("PAGE.ERROR:");
    this.echo(msg);
    this.echo(backtrace);
    this.echo("=========================");
});

/**
 * Log in to Entre.
 */
casper.then(function () {
    this.fill('form[action="/names.nsf?Login"]', {
        Username: username,
        Password: password
    }, false);
    this.click('input#loginSubmitButton');
});

/**
 * Wait for link to Webbattest becomes visible, and then click it.
 */
casper.waitForSelector('.scrollFixLeftmenu', function () {
    this.click('.scrollFixLeftmenu a[title*="Webbattest"]');
});

/**
 * Wait for Webbattest to be opened in new window.
 */
casper.waitForPopup('http://tstxpandwebb.stofast.se');

/**
 * Do the following in the Webbattest window:
 */
casper.withPopup(/tstxpandwebb.stofast.se/, function () {
    /**
     * Wait for the "search for supplier invoices link" becomes visible...
     */
    this.waitForSelector('#ctl00_cphMainFrame_lbtSupplierInvoiceList', function () {
        /**
         * ...and click it.
         */
        this.click('#ctl00_cphMainFrame_lbtSupplierInvoiceList');

        this.waitForUrl(/SupplierInvoiceListSearch/);

        /**
         * Select company from the drop-down list...
         */
        this.waitForSelector('#ctl00_cphMainFrame_SupplierInvoiceUC1_realEstateObjectSelectionUC_ddlCompanies', function () {
            this.evaluate(function (index) {
                var form = document.querySelector('#ctl00_cphMainFrame_SupplierInvoiceUC1_realEstateObjectSelectionUC_ddlCompanies');
                form.selectedIndex = index;
                $(form).change(); // <-- works because Xpand uses jQuery
            }, 1);
        });

        /**
         * ...and wait for the page to reload.
         */
        this.wait(2000, function () {
            /**
             * Click search button:
             */
            casper.sendKeys('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_txtVerificateAccountYear', "" + year);
        });

        this.wait(5000, function () {
            /**
             * Click search button:
             */
            this.click('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_btnFilter');
        });

        this.wait(5000, function () {
        });

        this.waitForSelector('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr tbody', function () {

            const HEADER_ROW_COUNT = 1;

            // Calculate the number of invoice table rows that were found
            var rows = this.evaluate(function () {
                return document.querySelectorAll('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr tbody tr').length;
            });

            this.echo("Number of invoices listed: " + (rows - HEADER_ROW_COUNT));

            var currentRow = rows;//Math.min(rows, 51);

            /**
             * Used to store invoice metadata which will be saved to file at the end.
             */
            var invoicesMetadata = [];

            // Add headers to metadata file contents.
            invoicesMetadata.push(["FIL", "LEVERANTOR", "REFERENS", "BELOPP", "DATUM"].join("\t"));

            /**
             * Recursive function for processing rows.
             */
            var processNextRow = function () {

                // Exit condition:
                if (currentRow <= HEADER_ROW_COUNT) {
                    writeToFile.call(this, invoicesMetadata, outputFolder + "/invoices-" + getDate() + ".tsv");
                    return;
                }

                //this.capture('homepage' + getDate() + '.png')
                var supplierInvoiceReference = this.fetchText('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr tbody tr:nth-child(' + (currentRow) + ') td:nth-child(1)');
                var supplierName = this.fetchText('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr tbody tr:nth-child(' + (currentRow) + ') td:nth-child(2)');
                var amount = this.fetchText('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr tbody tr:nth-child(' + (currentRow) + ') td:nth-child(3)');
                var invoiceDate = this.fetchText('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr tbody tr:nth-child(' + (currentRow) + ') td:nth-child(6)');

                var targetTitle = (invoiceDate + " " + supplierName + " " + supplierInvoiceReference).replace(/[^a-zA-Z0-9\u00C0-\u00D6\u00E0-\u00F6 ._&-]/g, '').trim();
                if (targetTitle == '') {
                    this.echo('No metadata found for invoice ' + currentRow);
                    targetTitle = 'Untitled Invoice ' + getDate();
                }
                var targetFile = targetTitle + ".pdf";

                // Only keep characters we know and trust: the English ones and a bunch of accented ones.
                var targetPath = outputFolder + "/" + targetFile;//link.replace('https://entre.stofast.se', '').replace(/[^a-z0-9.]/g, '') + ".pdf";

                invoicesMetadata.push([targetFile, supplierName, supplierInvoiceReference, amount, invoiceDate].join("\t"));

                if (!fs.exists(targetPath)) {
                    /**
                     * Click row in invoice overview tab:
                     */
                    this.click('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr tbody tr:nth-child(' + (currentRow) + ')')
                    this.wait(3000, function () {
                        /**
                         * Clicking the row switches to the second tab, but we want the third one:
                         */
                        this.click('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_jqtInvoiceDocumentViewer');
                        this.wait(3000, function () {

                            var link = this.getElementAttribute('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_InvoiceDocumentViewer1_invoiceDocumentViewerIframe', 'src');
                            this.echo("Downloading " + link + " to " + targetPath);
                            this.download(link, targetPath);

                            // Decrease row counter, in preparation for next call to processNextRow.
                            currentRow--;

                            // Click on the first tab, the overview tab, and wait for that tab to load:
                            this.click('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_jqtInvoiceList');
                            this.wait(3000, processNextRow);
                        });
                    });
                } else {
                    this.echo(targetPath + ' already downloaded. Moving on.');
                    currentRow--;
                    processNextRow.apply(this);
                }
            };

            // Process first row (actually the last invoice in the search result since we start from the end):
            processNextRow.apply(this);
        }, null, 30000);
    });
});

casper.run();
