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

1. Installera NodeJS (behöver PATH-variabeln uppdateras?)
2. Installera PhantomJS (glöm inte att uppdatera PATH-variabeln)
3. Ladda ner det här git-repot, antingen som en zip-fil eller mha. `git clone`
4. Starta en kommandoprompt i mappen där skriptet finns och kör `npm install`
    
Om något krånglar så kanske det finns användbara tips på http://docs.casperjs.org/en/latest/installation.html.

Användning
==========

1. Starta en kommandoprompt och gå till mappen där du sparat skriptet.

2. Kör detta kommando: `node_modules\casperjs\bin\casperjs.exe download.js --username=YOUR_ENTRE_USERNAME --password=YOUR_ENTRE_PASSWORD --directory=PATH_TO_PDF_FOLDER`

