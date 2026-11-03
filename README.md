# Gastheerschap · Maris College Bohemen · Versie 3

Eén statisch leerplatform voor 4 kader E&O: acht bijeenkomsten, theorie en SE-trainer, zes kookmomenten, zelfcorrigerende lessen, tafel indekken, high tea voor de ouderen van Nolenshage, praktijkrubrics en een open docentenomgeving.

## Openen

1. Pak **de volledige ZIP uit**; laat de mappen bij elkaar.
2. Start vanaf de uitgepakte map een webserver: `python3 -m http.server 8000`.
3. Open `http://localhost:8000/` (leerlingen). Kies **Docentenomgeving** voor `docent.html`.
4. Binnen de docentenomgeving vind je de documentenbibliotheek en de overdraagbare leshandleiding. Navigeer terug via **Leerlingenomgeving**.

Voor een statische host vormen `index.html` en `docent.html` samen één website; alle paden zijn relatief en vereisen dezelfde basislocatie. Geen Node-server nodig voor hosting. `npm` is alleen voor tests.

## Wat is veranderd tegenover V2?

- Mobiel: compact keuzemenu dat meteen naar het gekozen onderdeel navigeert, plus directe wisselknop leerling/docent.
- Beide omgevingen gebruiken nu dezelfde drie code- en stijlbestanden. Daardoor hoeven fixes maar één keer te worden uitgevoerd.
- Docentenpagina geslonken van circa 19,9 MB naar minder dan 1 KB. De documenten zijn niet verdwenen, maar staan in `docenten-documenten/` als echte bestanden.
- Bestaande rubrics, theorie, lesonderdelen, quizvragen en browseropslag behouden.
- Toetsbare contentchecks toegevoegd (`npm test`).

## Tests

```bash
npm test
npm run check
```

De tests controleren o.a. acht bijeenkomsten, SE-hoofdstukken, rubricgewichten en de bijbehorende bronbestanden. **Het zijn statische/regressietests, geen volledige end-to-end-browsertests.** Doe vóór livegang een handmatige proef op telefoon en laptop.

## Voor publicatie controleren

- Controleer de rechten om de bestanden van de uitgever en afbeeldingen te verspreiden. De bibliotheek bevat uitgeversmateriaal. Publiceer deze niet zonder toestemming of passende licentie.
- De open docenteningang is niet geschikt voor vertrouwelijke persoonsgegevens of cijfers. De resultaten worden uitsluitend lokaal in de browser opgeslagen, zonder synchronisatie of accounts.
- Controleer inhoudelijke juistheid van recepten, voedselveiligheid, dieetwensen en allergenen en bevestig rubric als officiële beoordelingsregeling.
- Test HTML-paden op gekozen hosting, inclusief PDF's en downloads uit `docenten-documenten/`.
- Vul de datum van de high tea pas in zodra Nolenshage en de school die bevestigd hebben.
- Controleer de website op een actuele Android-telefoon, iPhone en schoollaptop; test navigatie, quiz, afvinklijst, import/export en berekening.

## Technische structuur

```
index.html                 leerlingen
 docent.html               docenten (open, geen wachtwoord)
assets/site.css            responsive design
assets/content.js          leerstof en praktijkgegevens
assets/app.js              interactie / voortgang
 docenten-documenten/      17 originele en leesversies
 tests/platform.test.mjs   regressietests
 AGENTS.md                 instructies voor Codex
```

## Publicatie in GitHub Pages

Maak een repository, plaats de bestanden in de root en kies bij GitHub **Settings → Pages → Deploy from a branch**, branch `main`, root `/`. Publiceer uitsluitend materiaal waarvoor de rechten zijn vastgesteld; GitHub Pages en bronbestanden in een openbare repository zijn voor iedereen toegankelijk. Een private repository maakt een openbare Pages-site niet automatisch privé.

## Publicatievoorbereiding na V3

De leerlingenpagina blijft de startpagina; docent.html is vrij toegankelijk. URL-fragmenten bewaren het gekozen onderdeel en ondersteunen de terugknop. Alle appbestanden gebruiken relatieve paden. Externe webfonts zijn verwijderd, zodat de basisweergave geen externe verbinding nodig heeft.

### Bronmateriaal en privacy

Er is geen licentie of schriftelijke toestemming voor openbaar verspreiden meegeleverd. Daarom worden `docenten-documenten/` en de twee oorspronkelijke handleidingen in de hoofdmap via `.gitignore` buiten commits gehouden. De documenten zijn lokaal behouden uit het oorspronkelijke ZIP-bestand; bewaar dat ZIP veilig in de schoolomgeving. Ook de twee ingesloten receptfoto’s uit het lesmateriaal zijn uit de openbare code gehaald. De eigen lesuitwerkingen, alle opdrachten, zelftoetsen en rubric blijven beschikbaar. Laat de school de rechten en de eigen lesuitwerkingen controleren vóór livegang. Er wordt geen toestemming verondersteld.

De documentenbibliotheek toont de catalogus, maar biedt standaard geen downloads aan. Alleen verbergen van links beveiligt bestanden niet: upload de uitgesloten bestanden dus ook niet handmatig. Het bewust activeren van downloads vereist een afzonderlijke rechtencontrole en het beschikbaar stellen van goedgekeurde bestanden. Gebruik uitsluitend anonieme leerlingcodes. De openbare docentomgeving biedt geen toegangscontrole of betrouwbare centrale cijferregistratie.

### Controle en GitHub Pages

Voer `npm run check` en `npm run test:content` uit. Start `python3 -m http.server 8000` in de repository en voer daarna `npm run test:browser` uit. De browsertest vereist Playwright (als ontwikkelingstool) en Chromium; stel zo nodig `CHROMIUM_PATH` en `TEST_URL` in. Deze cloudomgeving heeft beide beschikbaar. De browsertest draait op 1440, 390 en 320 pixels en controleert alle leerlingroutes, horizontale overflow, opslag na herladen, een zelftoets, uitnodigingspreview, de openbare bibliotheek en de volledige rubricberekening. Dit zijn browseremulaties, geen fysieke telefoontests.

Voor GitHub Pages: voeg alleen openbare bestanden toe aan de PR; controleer `git status --ignored`. Na samenvoegen en rechtencontrole: Settings → Pages → Deploy from a branch → main → / (root). `.nojekyll` is aanwezig. Er is geen automatische deployment toegevoegd. Controleer na publicatie opnieuw de leerlingen- en docenteningang onder het projectpad `/Gastheerschap-/`.

### Homescreen-icoon

De app gebruikt een eigen Gastheerschap-icoon (theekop met fonkeling), los van het officiële schoollogo. `manifest.webmanifest` bevat relatieve paden en Android-iconen van 192 en 512 pixels, inclusief een maskable variant. Beide ingangen verwijzen ook naar een Apple-touch-icoon van 180 pixels en een favicon. Het manifest voegt geen offlinefunctionaliteit toe. Een bestaande homescreen-snelkoppeling kan het oude icoon vasthouden; verwijder dan uitsluitend de snelkoppeling en voeg de website opnieuw toe. Wis geen websitegegevens: daarin staat de lokale voortgang.
