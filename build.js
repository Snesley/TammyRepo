// Builds the static site into ./dist from content/*.json and public/.
// No dependencies. Runs on Cloudflare Pages: `node build.js`, output dir `dist`.
const fs = require('fs');
const path = require('path');

const root = __dirname;
const dist = path.join(root, 'dist');
const required = ['content/site.json', 'content/projects.json', 'public/assets/styles.css', 'public/assets/main.js', 'public/admin/config.yml'];
const missing = required.filter((f) => !fs.existsSync(path.join(root, f)));
if (missing.length) {
  console.error('\nBUILD STOPPED: these files are missing from the repo:\n  - ' + missing.join('\n  - '));
  console.error('Folders found at the repo root: ' + fs.readdirSync(root).join(', '));
  console.error('Upload the missing files/folders to GitHub (keep the same folder names) and redeploy.\n');
  process.exit(1);
}
const site = JSON.parse(fs.readFileSync(path.join(root, 'content/site.json'), 'utf8'));
const { projects } = JSON.parse(fs.readFileSync(path.join(root, 'content/projects.json'), 'utf8'));

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const br = (s = '') => esc(s).replace(/\r?\n/g, '<br>');

const svg = (name, paths) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${name}" aria-hidden="true">${paths}</svg>`;
const ICON = {
  up: svg('arrow-up-right', '<path d="M7 7h10v10"></path><path d="M7 17 17 7"></path>'),
  down: svg('arrow-down', '<path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>'),
  download: svg('download', '<path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path>'),
  mail: svg('mail', '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect>'),
  phone: svg('phone', '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>'),
};
const SHAPE = { standard: '', book: ' book', tall: ' publishing-tall' };

const categories = [...new Set(projects.map((p) => p.category))];

const card = (p) => `<article><button type="button" class="project-button" aria-label="View ${esc(p.title)}"><div class="project-image${SHAPE[p.shape] ?? ''}"><img src="${esc(p.image)}" alt="${esc(p.alt || p.title)}" loading="lazy"><span class="project-open">${ICON.up.replace('width="24" height="24"', 'width="15" height="15"')}</span></div><div class="project-meta"><h3 class="project-title">${esc(p.title)}</h3><span class="project-type">${esc(p.category)}</span></div>${p.subtitle ? `<p class="project-subtitle">${esc(p.subtitle)}</p>` : ''}</button></article>`;

const divider = '<span class="small-divider"></span>';
const phoneHref = 'tel:+1' + String(site.phone || '').replace(/\D/g, '').replace(/^1/, '');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(site.seo_title)}</title>
<meta name="author" content="${esc(site.name)}">
<meta name="description" content="${esc(site.seo_description)}">
<meta property="og:title" content="${esc(site.share_title)}">
<meta property="og:description" content="${esc(site.share_description)}">
<meta property="og:type" content="website">
<meta property="og:image" content="${esc(site.share_image)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(site.share_title)}">
<meta name="twitter:description" content="${esc(site.share_description)}">
<meta name="twitter:image" content="${esc(site.share_image)}">
<link rel="preconnect" href="https://fonts.googleapis.com/">
<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="anonymous">
<link rel="icon" href="/favicon.ico" type="image/x-icon">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=Manrope:wght@400..800&display=swap">
<link rel="stylesheet" href="/assets/styles.css">
<link rel="stylesheet" href="/assets/extras.css">
</head>
<body>
<header class="site-header site-wrap"><a href="#" class="wordmark" aria-label="${esc(site.name)} home"><span class="wordmark-mark">ta.</span>${esc(site.name)}</a><nav class="header-nav" aria-label="Main navigation"><a class="nav-link" href="#work">Work</a><a class="nav-link" href="#about">About</a><a href="#contact" class="portfolio-button">Let’s connect ${ICON.up}</a></nav></header><main><section class="introduction site-wrap"><div class="eyebrow"><span class="location-dot"></span>${esc(site.location)}</div><h1 class="intro-heading">${esc(site.name)}<span class="role">${br(site.role)}</span></h1><div class="intro-bottom"><p class="intro-description">${br(site.intro)}</p><a class="work-scroll" href="#work">Explore my work ${ICON.down}</a></div></section><div class="skill-strip site-wrap"><div class="disciplines">${site.disciplines.map((d) => `<span>${esc(d)}</span>`).join(divider)}</div><div class="software"><span class="software-label">${esc(site.software_label)}</span>${site.software.map((x) => `<span>${esc(x)}</span>`).join('')}</div></div><section id="work" class="work-section site-wrap"><div class="section-top"><h2 class="section-title">Selected work<sup>${projects.length}</sup></h2><div class="filters" aria-label="Filter portfolio"><button type="button" class="portfolio-filter" aria-pressed="true">All work</button>${categories.map((c) => `<button type="button" class="portfolio-filter" aria-pressed="false">${esc(c)}</button>`).join('')}</div></div><div class="project-grid">${projects.map(card).join('')}</div>${site.portfolio_pdf ? `<div class="work-end"><a class="text-link" href="${esc(site.portfolio_pdf)}" target="_blank" rel="noreferrer" download>Download full portfolio ${ICON.download}</a></div>` : ''}</section><section id="about" class="about-section"><div class="site-wrap about-layout"><div><p class="section-kicker">${esc(site.about_kicker)}</p><h2 class="about-heading">${br(site.about_heading)}</h2></div><div>${site.about_paragraphs.map((t) => `<p class="about-copy">${esc(t)}</p>`).join('')}<div class="capabilities">${site.capabilities.map((c) => `<span>${esc(c)}</span>`).join('')}</div></div></div></section><section id="contact" class="contact-section site-wrap"><p class="section-kicker">${esc(site.contact_kicker)}</p><div class="contact-top"><div><h2 class="contact-heading">${br(site.contact_heading)}</h2><p class="contact-note">${esc(site.contact_note)}</p></div><a href="mailto:${esc(site.email)}" class="portfolio-button">Say hello ${ICON.up}</a></div><div class="contact-links"><a href="mailto:${esc(site.email)}">${ICON.mail}${esc(site.email)}</a><a href="${phoneHref}">${ICON.phone}${esc(site.phone)}</a></div></section></main><footer class="footer site-wrap"><span>${esc(site.footer_left)}</span><span>${esc(site.footer_right)}</span></footer>
<div class="lightbox" id="lightbox" hidden role="dialog" aria-modal="true" aria-label="Project preview">
  <button type="button" class="lightbox-close" id="lightbox-close" aria-label="Close">&times;</button>
  <figure><img id="lightbox-img" alt=""><figcaption id="lightbox-cap"></figcaption></figure>
</div>
<script src="/assets/main.js" defer></script>
</body>
</html>
`;

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(root, 'public'), dist, { recursive: true });
fs.writeFileSync(path.join(dist, 'index.html'), html);
console.log(`Built ${projects.length} projects -> dist/index.html`);
