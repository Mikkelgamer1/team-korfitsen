# Stald Magnus M. Nielsen – hjemmeside

Statisk site (HTML, CSS, lidt JavaScript). Ingen afhængigheder, ingen database og ingen egne cookies – Facebook-opslagene på forsiden hentes først efter samtykke. Kræver kun Node 20+ for at bygge.

```bash
node build.mjs --serve
```

Åbn derefter http://localhost:4173. Det færdige site ligger i `dist/`.

| Kommando | Gør |
| --- | --- |
| `node build.mjs` | Bygger `dist/` med de gemte data |
| `node build.mjs --hent` | Henter friske data fra Dansk Hestevæddeløb og bygger |
| `node build.mjs --serve` | Bygger og viser sitet lokalt |
| `node build.mjs --test` | Selvtjek af formatering og datalogik |

## Sådan holder sitet sig selv opdateret

Heste, resultater, kommende starter og statistik kommer fra Dansk Hestevæddeløbs sportsdata – de samme data, som travinfo.dk viser. `--hent` gemmer dem i `data/travinfo.json`, og siderne bygges ud fra den fil.

- **Heste i træning** følger den officielle træningsliste. Kommer en hest til eller rejser, følger siden selv med.
- **Resultater, statistik, søjlediagrammer, formkurve og Danmarkskortet** tegnes ud fra de samme data ved hver kørsel. Fejler hentningen, bygges der videre med de gemte data, og datoen for seneste opdatering står på siden.
- Magnus skal ikke gøre noget.

`.github/workflows/opdater.yml` kører `--hent` hver morgen og ved hvert push til `main` og udgiver på GitHub Pages. Sitet ligger foreløbig på https://mikkelgamer1.github.io/stald-magnus-m-nielsen/, hvor `robots.txt` holder det ude af søgemaskinerne. Når domænet er på plads, sættes repo-variablen `SITE_URL` til den rigtige adresse – så åbnes der for søgemaskinerne af sig selv.

Andre muligheder: Netlify eller Cloudflare Pages (build-kommando `node build.mjs --hent`, mappe `dist`, plus et dagligt build-hook), eller upload `dist/` til et almindeligt webhotel. På et webhotel uden automatik står tallene stille, indtil der bygges og uploades igen.

## Ret indhold

| Hvad | Hvor |
| --- | --- |
| Telefon, mail, adresse, links, domæne | `SITE` øverst i `templates.mjs` |
| Tekster | `templates.mjs` (én funktion pr. side) |
| Billeder af enkelte heste | `HESTEFOTO` i `templates.mjs` (hest-id → filnavn) |
| Banernes placering på kortet | `BANE_POS` i `templates.mjs` |
| Farver, typografi, layout | `assets/css/site.css` |
| Billeder | `assets/img/` – erstat filen med samme navn og størrelse |

Tjeklisten før lancering og listen over midlertidige billeder ligger i `LANCERING.md`, som kun findes lokalt.

## Kilder til fakta

| Oplysning | Kilde |
| --- | --- |
| Fødselsår, licens (A1), hjemmebane, farver, statistik, træningsliste, resultater | Dansk Hestevæddeløb / travinfo.dk, licens 517710 |
| Telefon, mail | skive-trav.dk/om-os/traenere og staldens Facebook-side |
| Adresse (Flyvej 16, 7800 Skive), ydelser (tilkøring af ungheste, træning af løbsheste) | Staldens Facebook-side |
| Sparring ved hestekøb og auktioner | Staldens Facebook-opslag 11. august 2026 |
| DM for jockeyer 2021, nr. 2 i 2024, travfamilie, Sigter mod stjernerne, Jockeyserien, ansat hos Morten Friis | travet.dk 18. februar 2025 |
| Summer Meeting Talents to år i træk | travet.dk 27. juni 2024 |
| Nominering til Årets Komet | danskhv.dk 10. januar 2025 |
| "En af landets yngste trænere" | travet.dk 16. maj 2026 |
| Karat C N som Kriteriumsvinder og debut for stalden | trav24.dk 1. september 2026, travservice.dk 20. september 2026 |
| Skive Trav: 1948, flytning 1966, lysanlæg 2019–20 | skive-trav.dk/om-os |
| Danmarks omrids på kortet (`data/danmark.json`) | Natural Earth 1:50m, public domain. Bornholm er udeladt, og banernes placering er omtrentlig |
