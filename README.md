# Mars-roveren Perseverance – dansk GitHub Pages-projekt

En dansk, browserbaseret introduktion til Python-programmering med en Mars-rover-simulator. Projektet indeholder syv missioner, en kodeeditor, tegnet terræn, rover-spor, nulstilling og en manuel testknap.

## Kom i gang

1. Opret et nyt repository på GitHub, fx `mars-rover-dansk`.
2. Upload `index.html`, `style.css`, `app.js` og `README.md` til roden af repository'et.
3. Åbn **Settings → Pages**.
4. Under **Build and deployment** vælger du **Deploy from a branch**.
5. Vælg branch `main` og mappe `/ (root)`, og tryk **Save**.
6. Vent på, at GitHub Pages publicerer siden. URL'en vises på Pages-siden.

Siden bruger Skulpt via CDN til at afvikle Python i browseren. Derfor kræves internetadgang, når simulatoren bruges.

## Funktioner

- Dansk brugerflade og syv missionsbeskrivelser.
- Python-editor med automatisk indrykning ved Enter og Tab-understøttelse.
- `rover.forward(meter)`, `rover.left(grader)` og `rover.right(grader)`.
- `for`-løkker og standard-Python-funktioner, som Skulpt understøtter.
- Canvas-baseret Mars-terræn med rover, kratermarkeringer, kløft og rutespor.
- Manuel knap til at teste løsningen; der gives vejledende feedback, ikke en karakter eller automatisk bestået/ikke bestået.
- Responsivt layout til mobil, tablet og computer.

## Vigtigt om simulator og missioner

Dette er en selvstændig genimplementering inspireret af emnet i 101 Computing-opgaverne, ikke en pixel-for-pixel-kopi af originalen. Missionsteksterne er skrevet på dansk, og terrænillustrationerne er tegnet i Canvas. Kontrollér licensen på originalmateriale, før billeder eller tekst genbruges.

Simulatoren er en læringsprototype. Mission 1 er den primære fuldt gennemarbejdede opgave. Mission 2–7 har introduktioner og startkode, som kan videreudvikles med mere præcise kort, målpunkter og missionsspecifik testlogik.

## Mappestruktur

```text
mars-rover-dansk/
├── index.html
├── style.css
├── app.js
└── README.md
```

## Videreudvikling

Gode næste skridt:
- Tilføj præcise baner og målpunkter pr. mission.
- Udvid testfunktionen, så den kontrollerer de konkrete mål på hver bane.
- Tilføj gemte fremskridt lokalt, tilgængelighedstest og flere hints.
- Overvej at fastlåse en testet Skulpt-version eller hoste afhængigheder lokalt, hvis siden skal bruges i et lukket undervisningsmiljø.
