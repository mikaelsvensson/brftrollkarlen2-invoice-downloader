Beskrivning
===========

Filen download.js �r ett skript f�r CasperJS (webbl�sare som kan k�ras i bakgrunden utan att n�gra f�nster visas)
som laddar ner alla fakturor, f�r innevarande �r, fr�n Xpand (via Entr�).

Skriptet �r utvecklat f�r brf. Trollkarlen 2.

Vad skriptet g�r:

* Loggar in p� Entr�
* G�r till Webbattest
* S�ker fram fakturor
* Sparar varje faktura lokalt p� datorn
* Sparar en �versiktsfil som inneh�ller metadata f�r varje fil som sparats (filnamn, leverant�r, belopp och datum)

Installation
============

1. Installera NodeJS fr�n https://nodejs.org/en/download/
2. Installera PhantomJS fr�n http://phantomjs.org/download.html (gl�m inte att uppdatera Windows milj�variabel PATH s� att den inkluderar s�kv�gen till PhantomJS bin-mapp)
3. Ladda ner det h�r git-repot, antingen som en zip-fil eller mha. `git clone`
4. Starta en kommandoprompt i mappen d�r skriptet finns och k�r `npm install`
    
Om n�got kr�nglar s� kanske det finns anv�ndbara tips p� http://docs.casperjs.org/en/latest/installation.html.

Anv�ndning
==========

1. Starta en kommandoprompt och g� till mappen d�r du sparat skriptet.

2. K�r detta kommando: `node_modules\casperjs\bin\casperjs.exe download.js --username=YOUR_ENTRE_USERNAME --password=YOUR_ENTRE_PASSWORD --directory=PATH_TO_PDF_FOLDER`

Om du vill ladda ner fakturorna f�r ett annat �r �n det nuvarande s� kan du anv�nda argumentet `--year` (exempel: `--year=2016`)  

Fels�kningar
============

Fel som kan uppst� direkt n�r du startar programmet:

    Fatal Windows exception, code 0xc0000005.
    PhantomJS has crashed. Please read the bug reporting guide at
    <http://phantomjs.org/bug-reporting.html> and file a bug report.

L�sningsf�rslag:

 * F�rs�k igen. Det h�nder ibland att PhantomJS kraschar innan nedladdningen hinner starta och ibland hj�lper det att helt enkelt testa igen.
 * Om ditt l�senordet inneh�ller n�gra "ovanliga tecken" s� ska du se till s� att hela l�senordet �r inom citationstecken.