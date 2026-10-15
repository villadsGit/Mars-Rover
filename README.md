# Mars-roveren Perseverance – dansk GitHub Pages-projekt

En dansk undervisningsprototype, hvor elever programmerer en Mars-rover i en 2D-simulator. Projektet kræver ingen buildproces eller eksterne biblioteker.

## Udgivelse på GitHub Pages
1. Opret et GitHub-repository.
2. Upload `index.html`, `style.css`, `app.js` og `README.md` til repositoryets rod.
3. Gå til **Settings → Pages**.
4. Vælg **Deploy from a branch**, branch `main` og mappe `/ (root)`, og gem.
5. Åbn den GitHub Pages-adresse, som GitHub viser.

## Funktioner
- Syv danske missioner med opgavebeskrivelser og startkode.
- Canvas-simulator med Mars-landskab, rover og synligt spor.
- Justerbar hastighed øverst til højre og animerede bevægelser.
- Hvide, stiplede rutemarkeringer til zigzag (mission 3), spiral (mission 4), firkant (mission 5) og 12-kant (mission 7).
- Kratere og en central forgrenet kløft i mission 6.
- Bonusopgaver i mission 5 og 6.
- Knapper til at køre kode, nulstille roveren, rydde sporet og gendanne startkoden.

## Kodeeditor
Editoren bruger en begrænset Python-lignende fortolker skrevet i JavaScript. Den understøtter `rover.forward(distance)`, `rover.left(degrees)`, `rover.right(degrees)`, `rover.circle(radius, extend)`, kommentarer og `for i in range(4):` med indrykkede kommandoer, inklusive indlejrede løkker. Dette er ikke en fuld Python-implementering. Der er grænser for indlejring, gentagelser og det samlede antal instruktioner for at undgå, at browseren fryser. Bevægelsesafstande er simulatorenheder, ikke virkelige meter.

## Bemærkninger
- De hvide rutelinjer er vejledende; der foretages ikke automatisk geometrisk vurdering af, om elevens spor følger ruten.
- `rover.circle(radius, extend)` tegner en tilnærmet bue via mange små fremad- og drejebevægelser.
- Projektet er en selvstændig læringsprototype og ikke en pixel-for-pixel-kopi af 101 Computing.
