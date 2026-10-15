# Team Korfitsen – hjemmeside

Statisk site for travtræner Nicklas Korfitsen (licens 508510). Ingen afhængigheder – kræver kun Node 20+.

```
node build.mjs            byg til dist/ med de gemte data
node build.mjs --hent     hent friske data fra Dansk Hestevæddeløb først
node build.mjs --serve    byg og vis på http://localhost:4173 (PORT=… for en anden port)
node build.mjs --test     selvtjek
```

## Det opdaterer sig selv

- **Heste i træning, resultater, kommende starter og statistik** hentes fra Dansk Hestevæddeløbs åbne data (samme kilde som travinfo.dk) og gemmes i `data/travinfo.json`.
- `.github/workflows/opdater.yml` henter data hver morgen og ved hvert push til `main`. Fejler hentningen, bygges der videre med de gemte data.
- På Vercel bygges sitet med `vercel.json` og får projektets adresse automatisk. En `vercel.app`- eller `github.io`-adresse holdes ude af søgemaskinerne.

## Ret indhold

Alt indhold står i `templates.mjs`: kontaktoplysninger i `SITE` øverst, højdepunkter i `HOEJDEPUNKTER`. Design i `assets/css/site.css`.
Når staldens Facebook-side er kendt, sættes `SITE.facebook` – så vises opslagene på forsiden (efter samtykke).

## Kilder

| Oplysning | Kilde |
| --- | --- |
| Født 1999, A1-licens, hjemmebane, adresse, telefon, farver | Dansk Hestevæddeløb (licens 508510) |
| Vang Hovedgaard, telefon | Staldens Instagram-profil @teamkorfitsen |
| Højdepunkter (Moor Jeting, Jane Hall, Gabi Kyvsgård, Ivana Nordic, 26. maj 2025) | Staldens egne opslag på Instagram |
| Knutsson Rising Star Cup 2020, første start i USA 25. marts 2022 med Epos Ostervang DK | harnessracingupdate.com og playmeadowlands.com (marts 2022) |
| Spar Nord Arena Aalborg | aav.dk |
