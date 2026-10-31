// Al HTML til sitet. Tekster rettes her; tal, heste og resultater kommer fra data/travinfo.json.

export const SITE = {
  // ← Bekræft domænet før lancering (kan også sættes med miljøvariablen SITE_URL). På Vercel bruges projektets adresse.
  url: (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL && 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL) || 'https://www.teamkorfitsen.dk').replace(/\/$/, ''),
  navn: 'Team Korfitsen',
  person: 'Nicklas Korfitsen',
  fornavn: 'Nicklas',
  licens: 508510,
  telefon: '+45 23 25 20 83',
  gade: 'Bakmøllevej 235',
  postnr: '9400',
  by: 'Nørresundby',
  sted: 'Vang Hovedgaard',
  facebook: 'https://www.facebook.com/profile.php?id=61569540068591', // opslag vises som kort, når FB_SIDE/FB_TOKEN er sat i GitHub
  instagram: 'https://www.instagram.com/teamkorfitsen/',
  instagramNavn: '@teamkorfitsen',
  travinfo: 'https://travinfo.dk/licenseholder-tabs/508510',
  hjemmebane: 'https://www.aav.dk/',
  kort: 'https://www.google.com/maps/search/?api=1&query=Bakm%C3%B8llevej+235%2C+9400+N%C3%B8rresundby',
};

const BANER = { Sk: 'Skive', 'Ål': 'Aalborg', 'År': 'Aarhus', Od: 'Odense', Ch: 'Charlottenlund', Bi: 'Billund', Bh: 'Bornholm', Ny: 'Nykøbing F.', Bs: 'Skovbo', Kl: 'Klampenborg', 'Åb': 'Åby', 'Jæ': 'Jägersro', Ax: 'Axevalla' };
// Banernes omtrentlige placering [længdegrad, breddegrad] til det skematiske Danmarkskort (svenske baner og Bornholm vises ikke).
const BANE_POS = { Sk: [9.06, 56.56], 'Ål': [9.87, 57.05], 'År': [10.2, 56.14], Od: [10.36, 55.4], Ch: [12.58, 55.75], Bi: [9.12, 55.73], Ny: [11.87, 54.77], Bs: [12.03, 55.46], Kl: [12.59, 55.77] };
const HJEM = 'Ål';
const NAV = [['om-nicklas/', 'Om Nicklas'], ['stalden/', 'Stalden'], ['heste/', 'Heste'], ['resultater/', 'Resultater']];

// Fotos fra staldens Instagram (@teamkorfitsen). navn: [forhold bredde/højde, bredder…, fotograf]. Fotografens signatur står også på billedet.
const FOTOS = {
  'foto-i-fart': [1.416, 480, 847, 'gormfoto.dk'],
  'foto-moor-jeting': [1.515, 480, 800, 'Burt Seeger'],
  'foto-moor-jeting-vinder': [1.515, 480, 800, 'Burt Seeger'],
  'foto-jane-hall': [1.494, 402, 'ALN Pressbild'],
  'foto-gabi-kyvsgaard': [1.499, 480, 1066, 'gormfoto.dk'],
  'foto-aalborg-1': [1.501, 480, 533, 'Hesselborg Foto'],
  'foto-aalborg-2': [1.501, 480, 533, 'Hesselborg Foto'],
  'foto-stor-pris': [1.501, 480, 800, 'Kjeld Mikkelsen Photography'],
  'foto-ivana-nordic': [1.501, 480, 800, 'Kjeld Mikkelsen Photography'],
  'foto-ivana-vinder': [0.976, 480, 520, 'Kjeld Mikkelsen Photography'],
};

// Højdepunkter, som stalden selv har delt på Instagram (@teamkorfitsen). Nyeste først. [måned, titel, tekst, foto, alt]
const HOEJDEPUNKTER = [
  ['2026-10', 'Moor Jeting', 'Vinder af Kriterium Consolation 2026 med Nicklas i sulkyen.', 'foto-moor-jeting', 'Moor Jeting med vinderdækken efter Kriterium Consolation 2026'],
  ['2026-03', 'Jane Hall', 'Vinder et V85-løb på Åbytravet i Sverige – kilometertid 1.12,1 med Nicklas som kusk.', 'foto-jane-hall', 'Travheste i fuld fart på Åbytravet'],
  ['2025-10', 'Gabi Kyvsgård', 'Vinder DM for hopper for andet år i træk.', 'foto-gabi-kyvsgaard', 'Gabi Kyvsgård med laurbærkrans og dækken efter DM for hopper'],
  ['2025-05', 'Hjemmebanedag i Aalborg', 'Tre sejre og to andenpladser på én løbsdag – 26. maj 2025.', 'foto-aalborg-2', 'Travhest med startnummer 2 på banen i Aalborg'],
  ['2024-09', 'Ivana Nordic', 'Vinder Aalborg Hoppechampionat. Samme weekend vinder også Karlo Vang, Golden Eye SF og Striking Eagle.', 'foto-ivana-nordic', 'Ivana Nordic med vinderdækken efter Aalborg Hoppechampionat 2024'],
];

// ---------- små hjælpere ----------

let R = ''; // sti tilbage til roden fra den side, der bygges
let V = ''; // versionsmærke til css/js
let KORT;   // Danmarks omrids og projektionstal fra data/danmark.json

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const nf = (n) => Number(n).toLocaleString('da-DK');
const kr = (n) => `${nf(n)}&nbsp;kr.`;
const d = (iso) => new Date(`${String(iso).slice(0, 10)}T12:00:00Z`);
const langDato = (iso) => new Intl.DateTimeFormat('da-DK', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d(iso));
const kortDato = (iso) => new Intl.DateTimeFormat('da-DK', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(d(iso));
const maaned = (ym) => new Intl.DateTimeFormat('da-DK', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d(`${ym}-15`));
const ugedag = (iso) => new Intl.DateTimeFormat('da-DK', { weekday: 'short', timeZone: 'UTC' }).format(d(iso));
const dkListe = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} og ${a.at(-1)}`);
const SVENSKE = ['Åb', 'Jæ', 'Ax'];
// API'et giver kun en kode. Ukendte koder er udenlandske baner (alle danske står i BANER), så de vises som Udlandet.
const bane = (kode) => BANER[kode] ?? 'Udlandet';
const tlfLink = SITE.telefon.replace(/\s/g, '');
const mio = (n) => (n / 1e6).toLocaleString('da-DK', { maximumFractionDigits: 1 });

/** "16,0a" → "1.16,0a". Tomt, hvis der ikke er en tid (fx galop uden tid). */
export const tid = (t) => (/^\d\d,\d/.test(t ?? '') ? `1.${t}` : '');

/** Hurtigste tid i en rekordstreng som "18,7k 14,3m *12,2am" → "1.12,2am". */
export const bedsteRekord = (mark) => {
  const tider = String(mark ?? '').replace(/\*/g, '').split(/\s+/).filter((x) => /^\d\d,\d/.test(x));
  tider.sort((a, b) => parseFloat(a.replace(',', '.')) - parseFloat(b.replace(',', '.')));
  return tider.length ? `1.${tider[0]}` : '';
};

/** Placering som den vises: 1, 2, 3 … "–" for uplaceret, "disk." for diskvalificeret. */
export const plac = (p) => (/^[1-9]\d*$/.test(p) ? p : p === 'd' ? 'disk.' : '–');

const pil = '<svg class="pil" viewBox="0 0 22 10" width="22" height="10" aria-hidden="true"><path d="M0 5h20M16 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
const ud = '<svg class="ud" viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path d="M1 9 9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
const nyFane = '<span class="sr"> (åbner i ny fane)</span>';
const ekstern = (href, tekst, cls = 'link') => `<a class="${cls}" href="${href}" target="_blank" rel="noopener">${tekst} ${ud}${nyFane}</a>`;
const knap = (href, tekst, cls = '') => `<a class="knap ${cls}" href="${R}${href}">${tekst} ${pil}</a>`;
const link = (href, tekst) => `<a class="link" href="${R}${href}">${tekst} ${pil}</a>`;
const foto = (navn, alt, { sizes = '100vw', lazy = true } = {}) => {
  const [forhold, ...rest] = FOTOS[navn];
  const bredder = rest.filter((x) => typeof x === 'number');
  const max = bredder.at(-1);
  const src = (w) => `${R}assets/img/${navn}-${w}.webp`;
  return `<img src="${src(bredder[0])}" srcset="${bredder.map((w) => `${src(w)} ${w}w`).join(', ')}" sizes="${sizes}" width="${max}" height="${Math.round(max / forhold)}" alt="${esc(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}>`;
};
const fotograf = (navn) => FOTOS[navn].at(-1);
// Foto med fotografens navn i hjørnet.
const fotoboks = (navn, alt, opt, cls = '') => `<figure class="foto ${cls}">${foto(navn, alt, opt)}<figcaption>Foto: ${fotograf(navn)}</figcaption></figure>`;
const striber = (cls = '') =>`<span class="striber ${cls}" aria-hidden="true"><i></i><i></i><i></i></span>`;

// ---------- afledte tal ----------

function afled(data, idag) {
  const heste = [...data.heste].sort((a, b) => b.praemier - a.praemier || a.navn.localeCompare(b.navn, 'da'));
  const navne = new Map(heste.map((h) => [h.id, h.navn]));
  const medNavn = (r) => ({ ...r, hest: navne.get(r.hestId) ?? r.hest });
  const saeson = data.traenerStatistik.find((s) => s.sejre > 0) ?? data.traenerStatistik.find((s) => s.starter > 0) ?? data.traenerStatistik[0];
  const kusk = data.kuskStatistik.find((s) => s.aar === saeson.aar) ?? data.kuskStatistik[0];
  const iAar = data.resultater.filter((r) => r.dato.startsWith(String(saeson.aar)));
  const antalPrBane = {};
  for (const r of iAar) antalPrBane[r.bane] = (antalPrBane[r.bane] ?? 0) + 1;
  const prNavn = {};
  for (const [kode, antal] of Object.entries(antalPrBane)) (prNavn[bane(kode)] ??= { kode, navn: bane(kode), antal: 0 }).antal += antal;
  const banetal = Object.values(prNavn).sort((a, b) => b.antal - a.antal);
  const traenerAar = data.traenerStatistik.filter((s) => s.starter > 0);
  return {
    heste,
    saeson,
    kusk,
    opdateret: langDato(data.opdateret),
    seneste: data.resultater.slice(0, 10).map(medNavn),
    kommende: data.kommende.filter((k) => k.dato >= idag).map(medNavn),
    banetal,
    banerIAar: [...banetal.filter((b) => b.navn !== 'Udlandet').map((b) => b.navn), ...(prNavn.Udlandet ? ['andre udenlandske baner'] : [])],
    svenske: banetal.filter((b) => SVENSKE.includes(b.kode)).map((b) => b.navn),
    udland: banetal.some((b) => !BANE_POS[b.kode]),
    hjemmestarter: antalPrBane[HJEM] ?? 0,
    ungheste: heste.filter((h) => h.alder <= 2),
    aldre: [Math.min(...heste.map((h) => h.alder)), Math.max(...heste.map((h) => h.alder))],
    traenerAar,
    foersteTraenerAar: traenerAar.at(-1)?.aar,
    traenerSejreIalt: traenerAar.reduce((s, x) => s + x.sejre, 0),
    fb: (data.facebook ?? []).slice(0, 5),
  };
}

// ---------- fælles dele ----------

// Staldens logo – hvid udgave med gennemsigtig baggrund (lavet ud fra den originale logofil).
const logo = (cls = '', alt = '') => `<img class="logo ${cls}" src="${R}assets/img/logo-hvid.png" width="1098" height="572" alt="${alt}">`;

const top = (sti) => `
<header class="top">
  <div class="top__inner wrap">
    <a class="top__logo" href="${R || './'}" aria-label="${SITE.navn} – til forsiden">${logo()}</a>
    <nav class="top__nav" aria-label="Primær navigation">
      ${NAV.map(([href, navn]) => `<a href="${R}${href}"${sti.startsWith(href) ? ' aria-current="page"' : ''}>${navn}</a>`).join('\n      ')}
    </nav>
    <a class="knap knap--lille top__cta" href="${R}kontakt/"${sti.startsWith('kontakt/') ? ' aria-current="page"' : ''}>Kontakt ${SITE.fornavn}</a>
    <button class="burger" type="button" aria-haspopup="dialog" aria-controls="menu" commandfor="menu" command="show-modal"><span>Menu</span><i aria-hidden="true"></i></button>
  </div>
</header>
<dialog class="menu" id="menu" aria-label="Menu">
  <div class="menu__top wrap">
    ${logo()}
    <button class="burger burger--luk" type="button" data-luk commandfor="menu" command="close"><span>Luk</span><i aria-hidden="true"></i></button>
  </div>
  <nav class="menu__nav wrap" aria-label="Menu">
    <ul>
      ${[['', 'Forside'], ...NAV, ['kontakt/', 'Kontakt']].map(([href, navn], i) => `<li style="--i:${i}"><a href="${R}${href || (R ? '' : './')}"${(href ? sti.startsWith(href) : sti === '') ? ' aria-current="page"' : ''}>${navn}</a></li>`).join('\n      ')}
    </ul>
  </nav>
  <div class="menu__bund wrap">
    <a href="tel:${tlfLink}">${SITE.telefon}</a>
    <a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram${nyFane}</a>
  </div>
</dialog>`;

const kontaktbaand = () => `
<section class="cta">
  ${striber('cta__striber')}
  <div class="wrap cta__inner">
    <div>
      <p class="etiket" data-vis>Kontakt</p>
      <h2 data-vis style="--i:1">Skal din hest <em>i træning?</em></h2>
      <p data-vis style="--i:2">Ring eller send en sms til ${SITE.fornavn} – så tager I en snak om hesten og mulighederne.</p>
    </div>
    <div class="cta__valg" data-vis style="--i:3">
      <a class="cta__tlf" href="tel:${tlfLink}">${SITE.telefon}</a>
      ${knap('kontakt/', `Kontakt ${SITE.fornavn}`, 'knap--sort')}
    </div>
  </div>
</section>`;

const bund = (o) => `
<footer class="bund">
  <div class="wrap bund__gitter">
    <div class="bund__brand">
      ${logo('logo--stor', SITE.navn)}
      <p>Professionel travtræning med Aalborg som hjemmebane. Træning af løbsheste og tilkøring af ungheste.</p>
    </div>
    <nav aria-label="Sider">
      <h2>Sider</h2>
      <ul>
        ${[...NAV, ['kontakt/', 'Kontakt']].map(([href, navn]) => `<li><a href="${R}${href}">${navn}</a></li>`).join('')}
      </ul>
    </nav>
    <div>
      <h2>Kontakt</h2>
      <ul>
        <li><a href="tel:${tlfLink}">${SITE.telefon}</a></li>
        <li><address>${SITE.gade}<br>${SITE.postnr} ${SITE.by}</address></li>
      </ul>
    </div>
    <div>
      <h2>Følg med</h2>
      <ul>
        <li>${ekstern(SITE.instagram, 'Instagram', '')}</li>
        ${SITE.facebook ? `<li>${ekstern(SITE.facebook, 'Facebook', '')}</li>` : ''}
        <li>${ekstern(SITE.travinfo, 'Travinfo', '')}</li>
      </ul>
    </div>
  </div>
  <div class="wrap bund__linje">
    <p>Hjemmebane: ${ekstern(SITE.hjemmebane, 'Spar Nord Arena Aalborg', '')}</p>
    <p>Resultater og statistik: Dansk Hestevæddeløb · opdateret ${o.opdateret}</p>
    <p>© ${new Date().getFullYear()} ${SITE.navn}</p>
  </div>
</footer>`;

const organisation = () => ({
  '@type': ['LocalBusiness', 'SportsOrganization'],
  '@id': `${SITE.url}/#stald`,
  name: SITE.navn,
  description: 'Professionel travtræning med Aalborg som hjemmebane: træning af løbsheste og tilkøring af ungheste.',
  url: `${SITE.url}/`,
  telephone: tlfLink,
  image: `${SITE.url}/assets/img/og.jpg`,
  sport: 'Travsport',
  address: { '@type': 'PostalAddress', streetAddress: SITE.gade, postalCode: SITE.postnr, addressLocality: SITE.by, addressCountry: 'DK' },
  founder: { '@id': `${SITE.url}/#person` },
  sameAs: [SITE.instagram, SITE.travinfo, SITE.facebook].filter(Boolean),
});
const person = () => ({
  '@type': 'Person',
  '@id': `${SITE.url}/#person`,
  name: SITE.person,
  jobTitle: 'Professionel travtræner og kusk',
  url: `${SITE.url}/om-nicklas/`,
  worksFor: { '@id': `${SITE.url}/#stald` },
  sameAs: [SITE.travinfo],
});

function layout({ sti, titel, beskrivelse, indhold, o, klasse = '', noindex = false }) {
  const kanonisk = `${SITE.url}/${sti}`;
  const sideNavn = [...NAV, ['kontakt/', 'Kontakt']].find(([href]) => href === sti)?.[1];
  const graf = [
    { '@type': 'WebSite', '@id': `${SITE.url}/#website`, url: `${SITE.url}/`, name: SITE.navn, inLanguage: 'da-DK' },
    organisation(),
    person(),
    ...(sideNavn ? [{ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Forside', item: `${SITE.url}/` }, { '@type': 'ListItem', position: 2, name: sideNavn, item: kanonisk }] }] : []),
  ];
  return `<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(beskrivelse)}">
${noindex ? '<meta name="robots" content="noindex">' : '<link rel="canonical" href="' + kanonisk + '">'}
<meta name="theme-color" content="#0b0d0c">
<meta property="og:type" content="website">
<meta property="og:locale" content="da_DK">
<meta property="og:site_name" content="${SITE.navn}">
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(beskrivelse)}">
<meta property="og:url" content="${kanonisk}">
<meta property="og:image" content="${SITE.url}/assets/img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Team Korfitsen – travtræner Nicklas Korfitsen, Aalborg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="48x48" href="${R}assets/img/ikon-48.png">
<link rel="apple-touch-icon" href="${R}assets/img/ikon-180.png">
<link rel="preload" href="${R}assets/fonts/barlow-condensed-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${R}assets/fonts/barlow-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${R}assets/css/site.css?v=${V}">
<script>document.documentElement.classList.add('js');setTimeout(function(){window.__klar||document.documentElement.classList.remove('js')},2500)</script>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graf }).replace(/</g, '\\u003c')}</script>
</head>
<body class="${klasse}">
<a class="skip" href="#indhold">Spring til indhold</a>
${top(sti)}
<main id="indhold">
${indhold}
</main>
${bund(o)}
<script src="${R}assets/js/site.js?v=${V}" defer></script>
</body>
</html>
`;
}

// Sidehoved: sort felt med stor titel, skrå striber i staldens farver og et lille nøgletal i hjørnet.
const sidehoved = ({ sti, h1, tekst, tal }) => `
<section class="sidehoved">
  ${striber('sidehoved__striber')}
  <div class="wrap sidehoved__inner">
    <nav class="sti" aria-label="Brødkrumme"><a href="${R}">Forside</a><span aria-hidden="true">/</span><span aria-current="page">${sti}</span></nav>
    <h1>${h1}</h1>
    <div class="sidehoved__bund">
      <p class="indled">${tekst}</p>
      ${tal ? `<p class="sidehoved__tal"><b>${tal[0]}</b><span>${tal[1]}</span></p>` : ''}
    </div>
  </div>
</section>`;

/**
 * Skematisk Danmarkskort. `punkter` er [{ kode, navn, antal? }]: med antal tegnes en boble med tallet i,
 * uden antal en lille prik. Hjemmebanen får en ring, og der tegnes linjer derfra til de andre baner.
 */
function danmarkskort(punkter, beskrivelse) {
  const { bredde, hoejde, lon0, lat1, kx, ky, sti } = KORT;
  const max = Math.max(1, ...punkter.map((p) => p.antal ?? 0));
  const vist = punkter.filter((p) => BANE_POS[p.kode]).map((p) => {
    const [lon, lat] = BANE_POS[p.kode];
    const r = p.antal ? +(8 + 6 * Math.sqrt(p.antal / max)).toFixed(1) : 7;
    return { ...p, x: +((lon - lon0) * kx).toFixed(1), y: +((lat1 - lat) * ky).toFixed(1), r, ydre: p.kode === HJEM ? r + (p.antal ? 4 : 6) : r };
  });
  const hjem = vist.find((p) => p.kode === HJEM);
  const ruter = hjem ? vist.filter((p) => p !== hjem) : [];

  // Navnet sættes dér, hvor det bedst holder sig inden for kortet og fri af ruter og andre baner.
  const navn = (p) => {
    const w = p.navn.length * 6.4, m = p.ydre + 6;
    const steder = [['start', p.x + m, p.y + 3.7], ['middle', p.x, p.y + m + 9], ['end', p.x - m, p.y + 3.7], ['end', Math.min(p.x + p.ydre, bredde - 4), p.y + m + 9], ['middle', p.x, p.y - m - 2]];
    const straf = ([anker, x, y]) => { // 100 for at stikke ud over kortet, 10 for at ramme en rute eller en anden bane
      const x0 = (anker === 'start' ? x : anker === 'end' ? x - w : x - w / 2) - 3, x1 = x0 + w + 6, y0 = y - 12, y1 = y + 4;
      const inde = (px, py, luft = 0) => px > x0 - luft && px < x1 + luft && py > y0 - luft && py < y1 + luft;
      const udenfor = x0 < 0 || x1 > bredde || y0 < 0 || y1 > hoejde;
      const rammer = vist.some((q) => q !== p && inde(q.x, q.y, q.ydre))
        || ruter.some((q) => { for (let t = 0; t <= 1; t += 0.02) if (inde(hjem.x + (q.x - hjem.x) * t, hjem.y + (q.y - hjem.y) * t)) return true; return false; });
      return (udenfor ? 100 : 0) + (rammer ? 10 : 0);
    };
    const [anker, x, y] = (p === hjem ? [steder[0], ...steder] : steder).map((sted, i) => [straf(sted) + i / 100, sted]).sort((a, b) => a[0] - b[0])[0][1];
    return `<text class="kort__navn" x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" text-anchor="${anker}">${esc(p.navn)}</text>`;
  };

  return `<svg class="kort__svg" viewBox="0 0 ${bredde} ${hoejde}" role="img" aria-label="${esc(beskrivelse)}">
        <path class="kort__land" d="${sti}"/>${ruter.map((p, i) => `
        <path class="kort__rute" pathLength="1" d="M${hjem.x},${hjem.y}L${p.x},${p.y}" style="--n:${i}"/>`).join('')}${vist.map((p, i) => `
        <g class="kort__bane" style="--n:${i}">${p === hjem ? `<circle class="kort__ring" cx="${p.x}" cy="${p.y}" r="${p.ydre}"/>` : ''}<circle class="kort__prik" cx="${p.x}" cy="${p.y}" r="${p.r}"/>${p.antal ? `<text class="kort__tal" x="${p.x}" y="${+(p.y + 3.3).toFixed(1)}" text-anchor="middle">${p.antal}</text>` : ''}${navn(p)}</g>`).join('')}
      </svg>`;
}

// ---------- genbrugte blokke ----------

const plKlasse = (p) => (p === '1' ? ' pl--1' : /^[23]$/.test(p) ? ' pl--23' : p === 'd' ? ' pl--tekst' : '');

const resultatRaekke = (r) => `
      <li class="res__r">
        <span class="pl${plKlasse(r.placering)}"><span class="sr">Placering: </span>${plac(r.placering)}</span>
        <span class="res__hest">${esc(r.hest)}</span>
        <span class="res__info"><time datetime="${r.dato}">${kortDato(r.dato)}</time> · ${esc(bane(r.bane))} · ${nf(r.distance)}&nbsp;m</span>
        <span class="res__tid">${tid(r.tid) || '<span aria-hidden="true">–</span><span class="sr">ingen tid</span>'}</span>
        <span class="res__kr">${r.praemie ? kr(r.praemie) : '<span aria-hidden="true">–</span><span class="sr">ingen præmie</span>'}</span>
      </li>`;
const resultatliste = (liste) => `<ol class="res">${liste.map(resultatRaekke).join('')}
    </ol>`;

const kommendeListe = (liste) => `<ul class="kom">${liste.map((k) => `
      <li>
        <time datetime="${k.dato}"><b>${new Date(`${k.dato}T12:00:00Z`).getUTCDate()}</b>${kortDato(k.dato).replace(/^\d+\.\s*/, '')}<small>${ugedag(k.dato)}</small></time>
        <span class="kom__hest">${esc(k.hest)}</span>
        <span class="kom__bane">${esc(bane(k.bane))} · ${k.loeb}. løb${k.kusk ? ` · ${esc(k.kusk)}` : ''}</span>
      </li>`).join('')}
    </ul>`;

// Rullende bånd med de seneste resultater. Indholdet gentages én gang, så båndet kan løbe i ring.
const ticker = (liste) => {
  const poster = liste.map((r) => `<li><span class="pl${plKlasse(r.placering)}">${plac(r.placering)}</span> ${esc(r.hest)} <small>${kortDato(r.dato)} · ${esc(bane(r.bane))}</small></li>`).join('');
  return `<div class="ticker" role="region" aria-label="Seneste resultater">
    <ul class="ticker__spor">${poster}</ul><ul class="ticker__spor" aria-hidden="true">${poster}</ul>
  </div>`;
};

const omHest = (h) => `${h.alder}-årig ${esc(h.koen.toLowerCase())}`;
const afstamning = (h) => (h.far ? `e. ${esc(h.far)} – ${esc(h.mor)}` : '');
const sejre = (h) => Number(h.placeringer.split('-')[0]) || 0;

// Hestekort i stil med et startnummer: nummer, navn og de vigtigste tal.
const hestekort = (h, i) => `
      <a class="startnr" href="https://travinfo.dk/horse_tabs/${h.id}" target="_blank" rel="noopener" data-vis style="--i:${i % 6}">
        <span class="startnr__nr" aria-hidden="true">${i + 1}</span>
        <h3>${esc(h.navn)}</h3>
        <p>${omHest(h)}</p>
        <p class="startnr__aft">${afstamning(h)}</p>
        <dl>
          <div><dt>Indkørt</dt><dd>${kr(h.praemier)}</dd></div>
          <div><dt>Sejre</dt><dd>${sejre(h)} <small>på ${h.starter}</small></dd></div>
          <div><dt>Rekord</dt><dd>${bedsteRekord(h.rekord) || '–'}</dd></div>
        </dl>
        <span class="startnr__ud">Travinfo ${ud}${nyFane}</span>
      </a>`;

const ydelser = (o) => `
    <ol class="ydelser">
      <li data-vis>
        <h3>Træning af løbsheste</h3>
        <p>Stalden træner og starter løbsheste i Danmark${o.svenske.length ? ' og Sverige' : o.udland ? ' og udlandet' : ''}. I ${o.saeson.aar} har staldens heste været til start i ${dkListe(o.banerIAar)}.</p>
      </li>
      <li data-vis style="--i:1">
        <h3>Tilkøring af ungheste</h3>
        <p>Ungheste køres til og bygges op mod deres første starter.${o.ungheste.length > 1 ? ` Lige nu står ${o.ungheste.length} åringer og 2-årige på træningslisten.` : ''}</p>
      </li>
      <li data-vis style="--i:2">
        <h3>Træner og kusk i én</h3>
        <p>${SITE.fornavn} kører selv mange af staldens heste i løb – i ${o.kusk.aar} er det blevet til ${o.kusk.starter} starter og ${o.kusk.sejre} sejre som kusk.</p>
      </li>
    </ol>`;

const hoejdepunkter = (antal = HOEJDEPUNKTER.length) => `
    <ol class="hoejde">${HOEJDEPUNKTER.slice(0, antal).map(([ym, titel, tekst, navn, alt], i) => `
      <li data-vis style="--i:${i}">
        ${fotoboks(navn, alt, { sizes: '(min-width: 1100px) 24vw, (min-width: 600px) 46vw, 92vw' })}
        <time datetime="${ym}">${maaned(ym)}</time>
        <h3>${esc(titel)}</h3>
        <p>${esc(tekst)}</p>
      </li>`).join('')}
    </ol>
    <p class="note" data-vis>Højdepunkterne er hentet fra staldens egne opslag på ${ekstern(SITE.instagram, 'Instagram')}.</p>`;

const statTabel = (titel, raekker) => `
      <div class="tabelboks" role="region" aria-label="${titel}" tabindex="0">
        <table class="tabel">
          <caption>${titel}</caption>
          <thead><tr><th scope="col">År</th><th scope="col">Starter</th><th scope="col">1.–2.–3.</th><th scope="col">Sejrs&shy;procent</th><th scope="col">Præmiesum</th></tr></thead>
          <tbody>${raekker.filter((s) => s.starter > 0).map((s) => `
            <tr><th scope="row">${s.aar}</th><td>${s.starter}</td><td>${s.sejre}–${s.toer}–${s.treer}</td><td>${s.procent}&nbsp;%</td><td>${kr(s.praemier)}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>`;

const formkurve = (liste) => `<ol class="form" aria-label="Placeringer i de seneste ${liste.length} starter, nyeste først">${liste.map((r) => `<li class="pl${plKlasse(r.placering)}"><span class="sr">${esc(r.hest)}: </span>${plac(r.placering)}</li>`).join('')}</ol>`;

/** Lang tekst forkortes ved et ordskifte. */
const kortTekst = (s, max = 240) => (s.length <= max ? s : `${s.slice(0, s.lastIndexOf(' ', max))}…`);

// De seneste Facebook-opslag (hentet af build.mjs) som kort. Vises kun, når der er opslag.
const fbKort = (liste) => `
    <ul class="fbkort" aria-label="Seneste opslag fra Facebook">${liste.map((p, i) => `
      <li data-vis style="--i:${i}">
        <a href="${esc(p.link)}" target="_blank" rel="noopener">
          ${p.billede ? `<img src="${R}assets/fb/${p.billede}" alt="" loading="lazy" decoding="async">` : ''}
          <time datetime="${p.dato}">${langDato(p.dato)}</time>
          ${p.tekst ? `<p>${esc(kortTekst(p.tekst))}</p>` : ''}
          <span class="fbkort__mere">Se opslaget på Facebook ${ud}</span>${nyFane}
        </a>
      </li>`).join('')}
    </ul>`;

const foelg = (fb = []) => `
<section class="sek sek--lys">
  <div class="wrap foelg">
    <div>
      <p class="etiket" data-vis>Følg med</p>
      <h2 data-vis style="--i:1">Hverdagen <em>på ${SITE.sted}.</em></h2>
      <p data-vis style="--i:2">Sejre, startdage og livet i stalden deles løbende${fb.length ? ' – her er de seneste opslag fra Facebook' : ' på Instagram og Facebook'}.</p>
    </div>
    <div class="foelg__links" data-vis style="--i:2">
      <a class="some" href="${SITE.instagram}" target="_blank" rel="noopener"><span>Instagram</span><b>${SITE.instagramNavn}</b>${ud}${nyFane}</a>
      ${SITE.facebook ? `<a class="some" href="${SITE.facebook}" target="_blank" rel="noopener"><span>Facebook</span><b>${SITE.navn}</b>${ud}${nyFane}</a>` : ''}
    </div>
    <!-- Ingen Facebook-indlejring: Facebook viser kun navn og profilbillede i sideplugin'et for denne side.
         Opslagene vises som kort ovenfor, når FB_SIDE/FB_TOKEN er sat i GitHub (se README). -->
  </div>
  ${fb.length ? `<div class="wrap">${fbKort(fb)}
  </div>` : ''}
</section>`;

// ---------- sider ----------

const forside = (o) => `
<section class="hero">
  <svg class="hero__bane" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect x="80" y="110" width="1040" height="480" rx="240" pathLength="1"/>
    <rect x="150" y="180" width="900" height="340" rx="170" pathLength="1"/>
  </svg>
  <div class="wrap hero__gitter">
    <div class="hero__tekst">
      <p class="etiket">Travtræner · Aalborg</p>
      <h1 class="hero__logo"><img src="${R}assets/img/logo-hvid.png" width="1098" height="572" alt="Team Korfitsen" fetchpriority="high"></h1>
      <p class="hero__indled">${SITE.person} er professionel travtræner og kusk med Aalborg som hjemmebane. Stalden holder til på ${SITE.sted} og har ${o.heste.length} heste i træning.</p>
      <p class="hero__valg">${knap('kontakt/', `Kontakt ${SITE.fornavn}`)} ${link('heste/', 'Se hestene')}</p>
    </div>
    <div class="hero__hoejre">
    ${fotoboks('foto-i-fart', 'Travhest i fuld fart med kusken i staldens grønne farver', { sizes: '(min-width: 901px) 40vw, 92vw', lazy: false }, 'hero__foto')}
    <div class="tavle" aria-label="Sæsonen i tal">
      <p class="tavle__titel">Sæson ${o.saeson.aar} <span>som træner</span></p>
      <dl>
        <div><dt>Sejre</dt><dd>${o.saeson.sejre}</dd></div>
        <div><dt>Starter</dt><dd>${o.saeson.starter}</dd></div>
        <div><dt>Sejrsprocent</dt><dd>${o.saeson.procent}<small>%</small></dd></div>
        <div><dt>Indkørt, kr.</dt><dd>${mio(o.saeson.praemier)}<small>mio.</small></dd></div>
      </dl>
      <p class="tavle__kilde">Dansk Hestevæddeløb · ${o.opdateret}</p>
    </div>
    </div>
  </div>
  ${ticker(o.seneste)}
</section>

<section class="sek">
  <div class="wrap intro">
    <div class="intro__tekst">
      <p class="etiket" data-vis>Om ${SITE.fornavn}</p>
      <h2 data-vis style="--i:1">Ung træner. <em>Erfaren kusk.</em></h2>
      <p class="indled" data-vis style="--i:2">${SITE.person} er født i 1999 og har A1-licens som både træner og kusk.</p>
      <p data-vis style="--i:3">Som ung kusk vandt han Knutsson Rising Star Cup i 2020 – en serie for unge kuske i Sverige – og i 2022 vandt han i sin første start i USA på The Meadowlands. Som træner har han startet heste siden ${o.foersteTraenerAar}${o.traenerSejreIalt ? ` og vundet ${o.traenerSejreIalt} løb` : ''}.</p>
      <p data-vis style="--i:4">${link('om-nicklas/', `Læs mere om ${SITE.fornavn}`)}</p>
    </div>
    <div data-vis style="--i:2">
      ${fotoboks('foto-ivana-nordic', 'Ivana Nordic med vinderdækken efter Aalborg Hoppechampionat 2024', { sizes: '(min-width: 901px) 40vw, 92vw' }, 'intro__foto')}
    </div>
  </div>
</section>

<section class="sek sek--sort">
  <div class="wrap">
    <div class="sekhoved">
      <div>
        <p class="etiket" data-vis>Heste i træning</p>
        <h2 data-vis style="--i:1">Holdet <em>lige nu.</em></h2>
      </div>
      <p data-vis style="--i:2">${o.heste.length} heste står på træningslisten${o.ungheste.length > 1 ? ` – ${o.heste.length - o.ungheste.length} i løbsalderen og ${o.ungheste.length} ungheste på vej` : ''}. Her er de seks, der har tjent mest.</p>
    </div>
    <div class="startnumre">${o.heste.slice(0, 6).map(hestekort).join('')}
    </div>
    <p class="midt" data-vis>${knap('heste/', `Se alle ${o.heste.length} heste`, 'knap--kant')}</p>
  </div>
</section>

<section class="sek">
  <div class="wrap">
    <div class="sekhoved">
      <div>
        <p class="etiket" data-vis>Resultater</p>
        <h2 data-vis style="--i:1">Seneste <em>fra banen.</em></h2>
      </div>
      <p data-vis style="--i:2">Hentet fra Dansk Hestevæddeløb og opdateret ${o.opdateret}.<br>${link('resultater/', 'Alle resultater og statistik')}</p>
    </div>
    <div class="resgitter">
      <div data-vis>
        <h3 class="mini">Seneste starter</h3>
        ${resultatliste(o.seneste.slice(0, 6))}
      </div>
      <aside data-vis style="--i:1">
        <h3 class="mini">Kommende starter</h3>
        ${o.kommende.length ? kommendeListe(o.kommende.slice(0, 5)) : '<p>Ingen af staldens heste er startmeldt lige nu.</p>'}
      </aside>
    </div>
  </div>
</section>

<section class="sek sek--groen">
  <div class="wrap">
    <div class="sekhoved">
      <div>
        <p class="etiket" data-vis>Højdepunkter</p>
        <h2 data-vis style="--i:1">Store dage <em>for holdet.</em></h2>
      </div>
    </div>
    ${hoejdepunkter(4)}
  </div>
</section>

<section class="sek">
  <div class="wrap duo">
    <div>
      <p class="etiket" data-vis>Stalden</p>
      <h2 data-vis style="--i:1">Fra ${SITE.sted} <em>til hele Norden.</em></h2>
      <p class="indled" data-vis style="--i:2">Hjemmebanen er Aalborg${o.hjemmestarter ? `, hvor stalden har haft ${o.hjemmestarter} starter i ${o.saeson.aar}` : ''}. Men holdet kører også løb landet rundt${o.svenske.length ? ` og i Sverige – bl.a. på ${dkListe(o.svenske)}` : o.udland ? ' og i udlandet' : ''}.</p>
      <p data-vis style="--i:3">${link('stalden/', 'Mere om stalden')}</p>
    </div>
    <figure class="kort" data-vis style="--i:2">
      ${danmarkskort(o.banetal, `Danmarkskort med staldens starter pr. bane i ${o.saeson.aar}: ${o.banetal.map((b) => `${b.navn} ${b.antal}`).join(', ')}.`)}
      <figcaption>Starter pr. dansk bane i ${o.saeson.aar}. Ringen markerer hjemmebanen.</figcaption>
    </figure>
  </div>
</section>

<section class="stribe" aria-label="Billeder fra banen">
  <div class="stribe__spor">
    ${fotoboks('foto-moor-jeting-vinder', 'Vindercirklen efter Kriterium Consolation 2026 med Moor Jeting', { sizes: '(min-width: 900px) 34vw, 80vw' })}
    ${fotoboks('foto-stor-pris', 'Travheste i fuld fart i Aalborg', { sizes: '(min-width: 900px) 34vw, 80vw' })}
    ${fotoboks('foto-ivana-vinder', 'Nicklas Korfitsen i vindercirklen med Ivana Nordic efter Aalborg Hoppechampionat 2024', { sizes: '(min-width: 900px) 22vw, 60vw' })}
    ${fotoboks('foto-aalborg-1', 'Travhest med startnummer 5 på banen i Aalborg', { sizes: '(min-width: 900px) 34vw, 80vw' })}
  </div>
</section>
${foelg(o.fb)}
${kontaktbaand()}`;

const omNicklas = (o, data) => `
${sidehoved({
  sti: `Om ${SITE.fornavn}`,
  h1: `${SITE.fornavn} <em>Korfitsen</em>`,
  tekst: `Professionel travtræner og kusk med ${esc(data.traener.licens)}-licens. Født i ${data.traener.foedt} – og med Aalborg som hjemmebane.`,
  tal: [o.traenerSejreIalt, `sejre som træner siden ${o.foersteTraenerAar}`],
})}

<section class="sek">
  <div class="wrap artikel">
    <aside class="fakta" data-vis>
      ${fotoboks('foto-ivana-vinder', 'Nicklas Korfitsen i vindercirklen med Ivana Nordic efter Aalborg Hoppechampionat 2024', { sizes: '(min-width: 901px) 320px, 92vw' }, 'fakta__foto')}
      <h2 class="mini">Kort fortalt</h2>
      <dl>
        <div><dt>Født</dt><dd>${data.traener.foedt}</dd></div>
        <div><dt>Licens</dt><dd>${esc(data.traener.licens)} – professionel træner og kusk</dd></div>
        <div><dt>Hjemmebane</dt><dd>Aalborg</dd></div>
        <div><dt>Farver</dt><dd>Grøn og sort</dd></div>
        <div><dt>Stald</dt><dd>${SITE.sted}</dd></div>
        <div><dt>Heste i træning</dt><dd>${o.heste.length}</dd></div>
      </dl>
    </aside>
    <div class="prosa">
      <h2 data-vis>Kusken</h2>
      <p class="indled" data-vis>${SITE.person} slog igennem som kusk, før han fik sin egen stald.</p>
      <p data-vis>I 2020 vandt han Knutsson Rising Star Cup, en serie for unge kuske i Sverige. Sejren gav en tur til USA, og 25. marts 2022 vandt han i sin første start på The Meadowlands med Epos Ostervang DK, der førte fra start til mål.</p>
      <p data-vis>Som kusk har han i flere sæsoner kørt over 200 løb om året – i 2024 blev det til ${data.kuskStatistik.find((s) => s.aar === 2024)?.sejre ?? '–'} sejre.</p>

      <h2 data-vis>Træneren</h2>
      <p data-vis>Som træner har ${SITE.fornavn} startet heste siden ${o.foersteTraenerAar}. Lige nu står ${o.heste.length} heste på træningslisten, og i ${o.saeson.aar} har stalden vundet ${o.saeson.sejre} løb på ${o.saeson.starter} starter.</p>
      <p data-vis>Blandt staldens højdepunkter er to sejre i DM for hopper med Gabi Kyvsgård, Ivana Nordics sejr i Aalborg Hoppechampionat og Jane Halls sejr i et V85-løb på Åby.</p>
    </div>
  </div>
</section>

<section class="sek sek--groen">
  <div class="wrap">
    <div class="sekhoved">
      <div>
        <p class="etiket" data-vis>Højdepunkter</p>
        <h2 data-vis style="--i:1">Store dage <em>for holdet.</em></h2>
      </div>
    </div>
    ${hoejdepunkter()}
  </div>
</section>

<section class="sek">
  <div class="wrap">
    <div class="sekhoved">
      <div>
        <p class="etiket" data-vis>Statistik</p>
        <h2 data-vis style="--i:1">Sæson <em>for sæson.</em></h2>
      </div>
      <p data-vis style="--i:2">Officielle tal fra Dansk Hestevæddeløb, opdateret ${o.opdateret}.<br>${ekstern(SITE.travinfo, 'Se alle tal på Travinfo')}</p>
    </div>
    <div class="tabeller" data-vis>
      ${statTabel('Som træner', data.traenerStatistik)}
      ${statTabel('Som kusk', data.kuskStatistik)}
    </div>
  </div>
</section>
${kontaktbaand()}`;

const stalden = (o) => `
${sidehoved({
  sti: 'Stalden',
  h1: `Stalden <em>på ${SITE.sted}</em>`,
  tekst: `${SITE.navn} træner ${o.heste.length} heste – fra åringer til rutinerede løbsheste – med Aalborg som hjemmebane.`,
  tal: [o.heste.length, 'heste i træning'],
})}

<section class="sek">
  <div class="wrap">
    <div class="sekhoved">
      <div>
        <p class="etiket" data-vis>Det tilbyder stalden</p>
        <h2 data-vis style="--i:1">Fra første tilkøring <em>til målstregen.</em></h2>
      </div>
      <p data-vis style="--i:2">Stalden har lige nu heste fra ${o.aldre[0]} til ${o.aldre[1]} år i træning.</p>
    </div>
    ${ydelser(o)}
    <p class="note" data-vis>Kontakt ${SITE.fornavn} for pris. ${link('kontakt/', `Kontakt ${SITE.fornavn}`)}</p>
    <div class="fotopar" data-vis>
      ${fotoboks('foto-gabi-kyvsgaard', 'Gabi Kyvsgård med laurbærkrans og dækken efter DM for hopper', { sizes: '(min-width: 900px) 46vw, 92vw' })}
      ${fotoboks('foto-aalborg-2', 'Travhest med startnummer 2 på banen i Aalborg', { sizes: '(min-width: 900px) 46vw, 92vw' })}
    </div>
  </div>
</section>

<section class="sek sek--sort">
  <div class="wrap duo">
    <div>
      <p class="etiket" data-vis>Banerne</p>
      <h2 data-vis style="--i:1">Hjemme i <em>Aalborg.</em></h2>
      <p class="indled" data-vis style="--i:2">Spar Nord Arena Aalborg er staldens hjemmebane${o.hjemmestarter ? ` – i ${o.saeson.aar} har stalden haft ${o.hjemmestarter} starter her` : ''}.</p>
      <p data-vis style="--i:3">I ${o.saeson.aar} har holdet startet heste på ${o.banetal.length} baner${o.svenske.length ? `, heraf ${o.svenske.length} i Sverige (${dkListe(o.svenske)})` : ''}.</p>
      <ul class="banetal" data-vis style="--i:4">${o.banetal.map((b) => `
        <li><span>${esc(b.navn)}</span><b>${b.antal}</b></li>`).join('')}
      </ul>
      <p class="valg" data-vis style="--i:5">${ekstern(SITE.hjemmebane, 'aav.dk')} ${ekstern(SITE.kort, 'Find vej til stalden')}</p>
    </div>
    <figure class="kort" data-vis style="--i:2">
      ${danmarkskort(o.banetal, `Danmarkskort med staldens starter pr. bane i ${o.saeson.aar}: ${o.banetal.map((b) => `${b.navn} ${b.antal}`).join(', ')}.`)}
      <figcaption>Starter pr. dansk bane i ${o.saeson.aar}. Ringen markerer hjemmebanen.</figcaption>
    </figure>
  </div>
</section>

<section class="sek">
  <div class="wrap adresse">
    <div data-vis>
      <p class="etiket">Adresse</p>
      <address class="adresse__stor">${SITE.navn}<br>${SITE.gade}<br>${SITE.postnr} ${SITE.by}</address>
    </div>
    <p data-vis style="--i:1">${ekstern(SITE.kort, 'Åbn i Google Maps', 'knap knap--kant')}</p>
  </div>
</section>
${foelg()}
${kontaktbaand()}`;

const hesteraekke = (h, i) => `
      <li class="hest" id="hest-${h.id}" data-vis style="--i:${i % 6}">
        <div class="hest__navn">
          <h3>${esc(h.navn)}</h3>
          <p>${omHest(h)}${afstamning(h) ? ` · ${afstamning(h)}` : ''}</p>
        </div>
        ${h.starter ? `<dl class="hest__tal">
          <div><dt>Starter</dt><dd>${h.starter} <span>${esc(h.placeringer)}</span></dd></div>
          <div><dt>Indkørt</dt><dd>${kr(h.praemier)}</dd></div>
          <div><dt>Rekord</dt><dd>${bedsteRekord(h.rekord) || '–'}</dd></div>
        </dl>` : '<p class="hest__tal hest__tal--tom">Ustartet</p>'}
        <a class="hest__link" href="https://travinfo.dk/horse_tabs/${h.id}" target="_blank" rel="noopener" aria-label="${esc(h.navn)} på Travinfo (åbner i ny fane)">${ud}</a>
      </li>`;
const hestegruppe = (titel, heste) => (heste.length ? `
    <div class="gruppe">
      <h2 class="gruppe__titel" data-vis>${titel} <span>${heste.length}</span></h2>
      <ul class="hesteliste">${heste.map(hesteraekke).join('')}
      </ul>
    </div>` : '');

const heste = (o) => `
${sidehoved({
  sti: 'Heste',
  h1: 'Heste <em>i træning</em>',
  tekst: `Træningslisten kommer direkte fra Dansk Hestevæddeløb og følger automatisk med, når heste kommer til eller rejser videre.`,
  tal: [o.heste.length, 'heste på listen'],
})}

<section class="sek sek--sort">
  <div class="wrap">
    <div class="sekhoved">
      <div>
        <p class="etiket" data-vis>Mest vindende</p>
        <h2 data-vis style="--i:1">Holdets <em>profiler.</em></h2>
      </div>
      <p data-vis style="--i:2">De seks heste på listen, der har tjent mest i deres karriere.</p>
    </div>
    <div class="startnumre">${o.heste.slice(0, 6).map(hestekort).join('')}
    </div>
  </div>
</section>

<section class="sek">
  <div class="wrap">
    ${hestegruppe('Løbsheste', o.heste.filter((h) => h.alder >= 3))}
    ${hestegruppe('2-årige', o.heste.filter((h) => h.alder === 2))}
    ${hestegruppe('Åringer', o.heste.filter((h) => h.alder <= 1))}
    <p class="note" data-vis>Starter, placeringer (1.–2.–3.), præmiesum og rekord er livstal. Rekorden er hestens hurtigste kilometertid; a = autostart, k/m/l = kort, mellem og lang distance. Kilde: Dansk Hestevæddeløb, opdateret ${o.opdateret}.</p>
  </div>
</section>
${kontaktbaand()}`;

const resultater = (o, data) => `
${sidehoved({
  sti: 'Resultater',
  h1: 'Resultater <em>og statistik</em>',
  tekst: `Staldens seneste starter, kommende løb og sæsonens tal. Data kommer fra Dansk Hestevæddeløb og er senest opdateret ${o.opdateret}.`,
  tal: [o.saeson.sejre, `sejre i ${o.saeson.aar}`],
})}

<section class="sek sek--sort sek--smal">
  <div class="wrap">
    <h2 class="etiket" data-vis>Stalden i ${o.saeson.aar}</h2>
    <dl class="noegletal" data-vis style="--i:1">
      <div><dt>Starter</dt><dd>${o.saeson.starter}</dd></div>
      <div><dt>Sejre</dt><dd>${o.saeson.sejre}</dd></div>
      <div><dt>2.-pladser</dt><dd>${o.saeson.toer}</dd></div>
      <div><dt>3.-pladser</dt><dd>${o.saeson.treer}</dd></div>
      <div><dt>Sejrsprocent</dt><dd>${o.saeson.procent}<small>%</small></dd></div>
      <div><dt>Indkørt, kr.</dt><dd>${mio(o.saeson.praemier)}<small>mio.</small></dd></div>
    </dl>
    <div class="formboks" data-vis style="--i:2">
      <h3 class="mini">Formkurve – de seneste ${o.seneste.length} starter</h3>
      ${formkurve(o.seneste)}
    </div>
  </div>
</section>

<section class="sek">
  <div class="wrap resgitter">
    <div>
      <h2 class="mini" data-vis>De seneste ${o.seneste.length} starter</h2>
      <div data-vis>${resultatliste(o.seneste)}</div>
      <p class="note" data-vis>Tider er kilometertider. a = autostart, g = galop undervejs. – = uplaceret, disk. = diskvalificeret.</p>
    </div>
    <aside>
      <h2 class="mini" data-vis>Kommende starter</h2>
      ${o.kommende.length ? `<div data-vis style="--i:1">${kommendeListe(o.kommende)}</div>` : `<p data-vis style="--i:1">Ingen af staldens heste er startmeldt lige nu.</p>`}
      <p class="valg" data-vis style="--i:2">${ekstern(SITE.travinfo, 'Startlister på Travinfo')}</p>
    </aside>
  </div>
</section>

<section class="sek sek--lys">
  <div class="wrap">
    <div class="sekhoved">
      <div>
        <p class="etiket" data-vis>Statistik</p>
        <h2 data-vis style="--i:1">Sæson <em>for sæson.</em></h2>
      </div>
      <p data-vis style="--i:2">Alle resultater, startlister og detaljer findes hos Dansk Hestevæddeløb.<br>${ekstern(SITE.travinfo, 'Åbn Travinfo')}</p>
    </div>
    <div class="tabeller" data-vis>
      ${statTabel('Som træner', data.traenerStatistik)}
      ${statTabel('Som kusk', data.kuskStatistik)}
    </div>
  </div>
</section>
${kontaktbaand()}`;

const kontakt = () => `
${sidehoved({
  sti: 'Kontakt',
  h1: `Kontakt <em>${SITE.fornavn}</em>`,
  tekst: 'Har du en hest, der skal i træning, eller et spørgsmål til stalden? Ring eller send en sms.',
})}

<section class="sek">
  <div class="wrap kontakt">
    <div class="kontakt__felt kontakt__felt--tlf" data-vis>
      <h2 class="mini">Telefon</h2>
      <p class="kontakt__stor"><a href="tel:${tlfLink}">${SITE.telefon}</a></p>
      <p class="valg"><a class="knap" href="tel:${tlfLink}">Ring op ${pil}</a> <a class="link" href="sms:${tlfLink}">Send en sms ${pil}</a></p>
    </div>
    <div class="kontakt__felt" data-vis style="--i:1">
      <h2 class="mini">Instagram</h2>
      <p class="kontakt__stor kontakt__stor--lille"><a href="${SITE.instagram}" target="_blank" rel="noopener">${SITE.instagramNavn}${nyFane}</a></p>
      <p>Skriv en besked eller følg med i hverdagen.</p>
    </div>
    <div class="kontakt__felt kontakt__felt--kort" data-vis style="--i:2">
      <div>
        <h2 class="mini">Stalden</h2>
        <address>${SITE.navn}<br>${SITE.gade}<br>${SITE.postnr} ${SITE.by}</address>
        <p class="valg">${ekstern(SITE.kort, 'Find vej')}</p>
      </div>
      <div class="kort kort--mini">${danmarkskort([{ kode: HJEM, navn: 'Aalborg' }], 'Danmarkskort, hvor Aalborg er markeret')}</div>
    </div>
  </div>
</section>
${foelg()}`;

const ikkeFundet = () => `
<section class="sidehoved sidehoved--enkel">
  ${striber('sidehoved__striber')}
  <div class="wrap sidehoved__inner">
    <p class="etiket">Fejl 404</p>
    <h1>Siden <em>findes ikke</em></h1>
    <div class="sidehoved__bund">
      <p class="indled">Adressen er forkert, eller siden er flyttet.</p>
    </div>
    <p>${knap('', 'Til forsiden')}</p>
  </div>
</section>`;

/** Alle sider som [{ sti, html }]. `idag` er YYYY-MM-DD, `v` et versionsmærke til css/js. */
export function sider(data, { v, idag, kort }) {
  V = v;
  KORT = kort;
  const o = afled(data, idag);
  const side = (sti, def) => {
    R = sti === '404.html' ? new URL(SITE.url + '/').pathname : sti ? '../' : '';
    return { sti: sti.endsWith('.html') ? sti : `${sti}index.html`, url: sti, html: layout({ sti, o, ...def() }) };
  };
  return [
    side('', () => ({
      titel: `${SITE.navn} – travtræner ${SITE.person}, Aalborg`,
      beskrivelse: `${SITE.person} er professionel travtræner og kusk med Aalborg som hjemmebane. ${o.heste.length} heste i træning på ${SITE.sted}.`,
      klasse: 'forside',
      indhold: forside(o),
    })),
    side('om-nicklas/', () => ({
      titel: `Om ${SITE.person} – travtræner og kusk | ${SITE.navn}`,
      beskrivelse: `Mød ${SITE.person}: født 1999, vinder af Knutsson Rising Star Cup 2020 og i dag professionel travtræner og kusk med Aalborg som hjemmebane.`,
      indhold: omNicklas(o, data),
    })),
    side('stalden/', () => ({
      titel: `Stalden – travtræning ved Aalborg | ${SITE.navn}`,
      beskrivelse: `${SITE.navn} holder til på ${SITE.sted} med Aalborg som hjemmebane. Træning af løbsheste og tilkøring af ungheste.`,
      indhold: stalden(o),
    })),
    side('heste/', () => ({
      titel: `Heste i træning | ${SITE.navn}`,
      beskrivelse: `Se de ${o.heste.length} travheste, der lige nu er i træning hos ${SITE.person} – med afstamning, starter, præmiesum og rekord.`,
      indhold: heste(o),
    })),
    side('resultater/', () => ({
      titel: `Resultater og statistik | ${SITE.navn}`,
      beskrivelse: `Seneste resultater, kommende starter og sæsonstatistik for travtræner ${SITE.person}: ${o.saeson.sejre} sejre på ${o.saeson.starter} starter i ${o.saeson.aar}.`,
      indhold: resultater(o, data),
    })),
    side('kontakt/', () => ({
      titel: `Kontakt ${SITE.person} – travtræner ved Aalborg`,
      beskrivelse: `Kontakt ${SITE.navn}: telefon ${SITE.telefon}. Stalden ligger på ${SITE.gade}, ${SITE.postnr} ${SITE.by}.`,
      indhold: kontakt(),
    })),
    side('404.html', () => ({
      titel: `Siden findes ikke | ${SITE.navn}`,
      beskrivelse: `Siden findes ikke. Gå til forsiden for ${SITE.navn} – travtræner Nicklas Korfitsen på Vang Hovedgaard ved Aalborg.`,
      noindex: true,
      indhold: ikkeFundet(),
    })),
  ];
}
