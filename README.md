Beskrivning
===========

Filen download.js är ett skript för CasperJS (webbläsare som kan köras i bakgrunden utan att några fönster visas)
som laddar ner alla fakturor, för innevarande år, från Xpand (via Entré).

Skriptet är utvecklat för brf. Trollkarlen 2.

Vad skriptet gör:

* Loggar in på Entré
* Går till Webbattest
* Söker fram fakturor
* Sparar varje faktura lokalt på datorn
* Sparar en översiktsfil som innehåller metadata för varje fil som sparats (filnamn, leverantör, belopp och datum)

Installation
============

1. Installera NodeJS från https://nodejs.org/en/download/
2. Installera PhantomJS från http://phantomjs.org/download.html (glöm inte att uppdatera Windows miljövariabel PATH så att den inkluderar sökvägen till PhantomJS bin-mapp)
3. Ladda ner det här git-repot, antingen som en zip-fil eller mha. `git clone`
4. Starta en kommandoprompt i mappen där skriptet finns och kör `npm install`
    
Om något krånglar så kanske det finns användbara tips på http://docs.casperjs.org/en/latest/installation.html.

Användning
==========

1. Starta en kommandoprompt och gå till mappen där du sparat skriptet.

2. Kör detta kommando: `node_modules\casperjs\bin\casperjs.exe download.js --username=YOUR_ENTRE_USERNAME --password=YOUR_ENTRE_PASSWORD --directory=PATH_TO_PDF_FOLDER`

Om du vill ladda ner fakturorna för ett annat år än det nuvarande så kan du använda argumentet `--year` (exempel: `--year=2016`)  

Felsökningar
============

Fel som kan uppstå direkt när du startar programmet:

    Fatal Windows exception, code 0xc0000005.
    PhantomJS has crashed. Please read the bug reporting guide at
    <http://phantomjs.org/bug-reporting.html> and file a bug report.

Lösningsförslag:

 * Försök igen. Det händer ibland att PhantomJS kraschar innan nedladdningen hinner starta och ibland hjälper det att helt enkelt testa igen.
 * Om ditt lösenordet innehåller några "ovanliga tecken" så ska du se till så att hela lösenordet är inom citationstecken.