# Codex: Gastheerschap Maris College Bohemen — V3

## Begin hier
Dit is een bestaand lesplatform; **geen herschrijving van de leerinhoud**. Lees `README.md`, `assets/content.js` en `assets/app.js` vóór wijzigingen. Volg de oorspronkelijke lessen, HBR P1-samenvatting, praktijkcriteria en rubric.

## Functioneel te behouden
- 8 bijeenkomsten, minimaal 5 volledig beoordeelde kookmomenten (6 recepten in huidige programma)
- Theorie en interactieve zelfcorrectie: hoofdstukken 1, 2, 4, 6 = SE-stof. Overige theorie ondersteunt praktijk.
- Keukenlab, tafel indekken, poleren, bedienen, hygiëne, portfoliowerk.
- High tea voor ouderen van Nolenshage; **datum is nog onbekend**. Uitnodiging, menukaart en budget behouden.
- Praktijkrubric 100 punten: koken 30, gastheerschap 20, voorbereiding high tea 20, uitvoering 20, portfolio 10. Cijfer 1 + 9 × (score / 100), pas definitief bij compleet ingevulde rubrics en minstens vijf kookmomenten.
- Open docentenomgeving (`docent.html`) en leerlingeningang (`index.html`) via wederzijdse navigatie.
- Documentenbibliotheek onder `docenten-documenten/` (17 originele en voorbeeldbestanden).

## Techniek en testen
- Statische site met `assets/content.js` (data), `assets/app.js` (interactie), `assets/site.css` (stijl).
- Geen backend, geen serveraccounts; lokale voortgang in `localStorage` per browser en origin. Niet beweren dat er automatische synchronisatie is.
- Start met `python -m http.server 8000`, test met `npm test` en `npm run check`.
- Mobiele selectnavigatie en desktopzijbalk; verbeter toegankelijkheid en responsive gedrag zonder functionaliteit te verwijderen.

## Beveiliging en publicatie
- De open docenteningang is bewust niet beveiligd. **Geen echte namen, leerlingdossiers of vertrouwelijke cijfers** op publiek toegankelijke apparaten/servers.
- De documentenmap bevat materiaal van externe uitgever; publicatie vereist controle van toestemming/licentie. Zet deze map niet zomaar openbaar.
- Geen automatische deployment in deze repository. Publiceer pas na expliciete toestemming van de eigenaar voor verspreiding van alle bestanden.
- Een browsertest is niet automatisch in de testset opgenomen; voeg waar mogelijk Playwright e2e toe en controleer aparte mobiele/desktop-smoketests.
