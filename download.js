/**
 * Go to https://entre.stofast.se/
 * Type username into input[@name='Username']
 * Type password into input[@name='Password']
 * Click #loginSubmitButton
 * Wait for, and then click, .scrollFixLeftmenu a with text "Webbattest"
 * Switch to newly opened window
 * Click #ctl00_cphMainFrame_lbtSupplierInvoiceList
 * Select "18916 Trollkarlen 2 Brf" in #ctl00_cphMainFrame_SupplierInvoiceUC1_realEstateObjectSelectionUC_ddlCompanies
 * Wait for #ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_btnFilter to become enabled, and then click it
 * For each <tr> in #ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr > tbody:
 * - Click the <tr>
 * - Click #ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_jqtInvoiceDocumentViewer
 * - Get src attribute from #ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_InvoiceDocumentViewer1_invoiceDocumentViewerIframe
 * - Download file referenced in src attr.
 */

var fs = require('fs');

var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    viewportSize: {
        width: 800,
        height: 500
    }
});

//function getDate() {
//    return new Date().toISOString().replace(/[^0-9]/g, '');
//}

casper.start('https://entre.stofast.se');

var username = casper.cli.options.username;
var password = casper.cli.options.password;
var outputFolder = casper.cli.options.directory || ".";

casper.then(function () {
    this.fill('form[action="/names.nsf?Login"]', {
        Username: username,
        Password: password
    }, false);
    this.click('input#loginSubmitButton');
});

casper.on("popup.loaded", function (newPage) {
    console.log("Loaded " + newPage.url + " in popup window.");
});

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

casper.waitForSelector('.scrollFixLeftmenu', function () {
    this.click('.scrollFixLeftmenu a[title*="Webbattest"]');
});

casper.waitForPopup('http://xpandwebb.stofast.se', function () {
    console.log("waitForPopup done");
});

casper.withPopup(/xpandwebb.stofast.se/, function () {
    this.waitForSelector('#ctl00_cphMainFrame_lbtSupplierInvoiceList', function () {
        console.log("Loaded");

        this.click('#ctl00_cphMainFrame_lbtSupplierInvoiceList');

        this.waitForUrl(/SupplierInvoiceListSearch/, function () {
            console.log("SupplierInvoiceListSearch loaded");
        }, function () {
            console.log("SupplierInvoiceListSearch timeout");
        });

        this.waitForSelector('#ctl00_cphMainFrame_SupplierInvoiceUC1_realEstateObjectSelectionUC_ddlCompanies', function () {
            this.evaluate(function (index) {
                var form = document.querySelector('#ctl00_cphMainFrame_SupplierInvoiceUC1_realEstateObjectSelectionUC_ddlCompanies');
                form.selectedIndex = index;
                $(form).change(); // <-- works because Xpand uses jQuery
            }, 1);
        });

        this.wait(5000, function () {
            this.click('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_btnFilter');
        });

        this.wait(5000, function () {
        });

        this.waitForSelector('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr tbody', function () {
            var rows = this.evaluate(function () {
                var links = document.querySelectorAll('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr tbody tr');
                return links.length;
            });
            this.echo("Number of invoices listed: " + rows);
            var i = rows;//Math.min(rows, 51);

            var waitFunction = function () {

                if (i < 1) {
                    return;
                }

                //this.capture('homepage' + getDate() + '.png')
                var supplierInvoiceReference = this.fetchText('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr tbody tr:nth-child(' + (i) + ') td:nth-child(1)');
                var supplierName = this.fetchText('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr tbody tr:nth-child(' + (i) + ') td:nth-child(2)');
                //var amount = this.fetchText('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr tbody tr:nth-child(' + (i) + ') td:nth-child(3)');
                var invoiceDate = this.fetchText('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr tbody tr:nth-child(' + (i) + ') td:nth-child(6)');

                var targetFile = invoiceDate + " " + supplierName + " " + supplierInvoiceReference + ".pdf";
                // Only keep characters we know and trust: the English ones and a bunch of accented ones.
                var targetPath = outputFolder + "/" + targetFile.replace(/[^a-zA-Z0-9\u00C0-\u00D6\u00E0-\u00F6 ._&-]/g, '');//link.replace('https://entre.stofast.se', '').replace(/[^a-z0-9.]/g, '') + ".pdf";

                if (!fs.exists(targetPath)) {
                    this.click('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_gvInvoicesLr tbody tr:nth-child(' + (i) + ')')
                    this.wait(3000, function () {
                        this.click('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_jqtInvoiceDocumentViewer');
                        this.wait(3000, function () {
                            this.click('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_jqtInvoiceList');
                            this.wait(3000, function () {
                                //this.capture('homepage-' + getDate() + '-invoice.png');
                                var link = this.getElementAttribute('#ctl00_cphMainFrame_SupplierInvoiceUC1_jqTabs_InvoiceDocumentViewer1_invoiceDocumentViewerIframe', 'src');
                                this.echo("Downloading " + link + " to " + targetPath);
                                this.download(link, targetPath);
                                i--;
                                this.wait(3000, waitFunction);
                            });
                        });
                    });
                } else {
                    this.echo(targetPath + ' already downloaded. Moving on.');
                    i--;
                    waitFunction.apply(this);
                }
            };

            waitFunction.apply(this);
        });
    });
});

casper.run();