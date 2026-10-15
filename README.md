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
- `.github/workflows/opdater.yml` henter data hver morgen og ved hvert push til `main` og gemmer dem i repoet – så bygger Vercel en ny udgave. Fejler hentningen, bygges der videre med de gemte data.
- På Vercel bygges sitet med `vercel.json` og får projektets adresse automatisk. En `vercel.app`- eller `github.io`-adresse holdes ude af søgemaskinerne.

## Facebook-opslag på forsiden

De 5 seneste opslag fra staldens Facebook-**side** vises som kort under "Følg med" på forsiden. De hentes ved den daglige opdatering via Meta's Graph API, og billederne gemmes på sitet selv – så der er ingen indlejring, ingen cookies og intet klik. Er der ingen opslag, vises sektionen bare uden.

Opsætning (én gang, skal gøres af en administrator af Facebook-siden):

1. Gå til developers.facebook.com → **Mine apps** → **Opret app** (type: Virksomhed).
2. Åbn **Graph API Explorer**, vælg appen og siden, og giv tilladelserne  og . Hent et **sideadgangstoken** og forlæng det i **Access Token Debugger** ("Extend Access Token"). Et sidetoken lavet ud fra et forlænget brugertoken udløber ikke.
3. Find sidens id (står under sidens "Om" eller i Graph API Explorer:  med sidetokenet).
4. I GitHub-repoet: **Settings → Secrets and variables → Actions**:
   - **Secret**  = sidetokenet
   - **Variable**  = sidens id
5. Kør workflowet "Opdater data" (Actions → Run workflow). Så kommer opslagene på siden, og derefter opdateres de hver dag.

Tokenet ligger kun som hemmelighed i GitHub og kommer aldrig ud på sitet.

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
| Fotos | Staldens Instagram (@teamkorfitsen). Fotografer: Burt Seeger, ALN Pressbild, gormfoto.dk, Hesselborg Foto, Kjeld Mikkelsen Photography – navnet står ved hvert billede |
| Logo | Originalfil fra stalden (hvidt logo på grønt #396848) |
