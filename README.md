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

1. Installera NodeJS (beh�ver PATH-variabeln uppdateras?)
2. Installera PhantomJS (gl�m inte att uppdatera PATH-variabeln)
3. Ladda ner det h�r git-repot, antingen som en zip-fil eller mha. `git clone`
4. Starta en kommandoprompt i mappen d�r skriptet finns och k�r `npm install`
    
Om n�got kr�nglar s� kanske det finns anv�ndbara tips p� http://docs.casperjs.org/en/latest/installation.html.

Anv�ndning
==========

1. Starta en kommandoprompt och g� till mappen d�r du sparat skriptet.

2. K�r detta kommando: `node_modules\casperjs\bin\casperjs.exe download.js --username=YOUR_ENTRE_USERNAME --password=YOUR_ENTRE_PASSWORD --directory=PATH_TO_PDF_FOLDER`

