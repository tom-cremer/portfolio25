// Vérifie la sortie du build (dist/) pour l'i18n FR/EN.
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

const SITE = 'https://tomcremer.be';
const DIST = 'dist';
const PROJECTS_DIR = 'src/content/projets';
const failures = [];

const fail = (msg) => failures.push(msg);
const read = (path) => readFileSync(join(DIST, path), 'utf8');
const slugsIn = (dir) => existsSync(dir)
    ? readdirSync(dir).filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, ''))
    : [];
const htmlLang = (html) => html.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
const canonical = (html) => html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
const hasHreflang = (html, lang, href) =>
    new RegExp(`<link rel="alternate" hreflang="${lang}" href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(html);

if (!existsSync(DIST)) {
    console.error('dist/ not found — run `npm run build` first.');
    process.exit(1);
}

// 1. Every page from the original FR build still exists
const baseline = readFileSync('scripts/fixtures/fr-pages-baseline.txt', 'utf8').split('\n').filter(Boolean);
for (const page of baseline) {
    if (!existsSync(join(DIST, page))) fail(`FR page missing: ${page}`);
    else if (htmlLang(read(page)) !== 'fr') fail(`FR page without lang="fr": ${page}`);
}

// 2. EN pages exist with lang="en"
const frSlugs = slugsIn(PROJECTS_DIR);
const enSlugs = slugsIn(join(PROJECTS_DIR, 'en'));
const allSlugs = [...new Set([...frSlugs, ...enSlugs])];
const enPages = ['en/index.html', 'en/about/index.html', 'en/projects/index.html',
    ...allSlugs.map((s) => `en/projects/${s}/index.html`)];
for (const page of enPages) {
    if (!existsSync(join(DIST, page))) fail(`EN page missing: ${page}`);
    else if (htmlLang(read(page)) !== 'en') fail(`EN page without lang="en": ${page}`);
}

// 3. EN pages never link to FR internal pages (the FR switcher link is marked hreflang="fr")
const FR_LINK = /<a(?![^>]*hreflang="fr")[^>]*\shref="\/(apropos|projets|#contact)[^"]*"/;
for (const page of enPages.filter((p) => existsSync(join(DIST, p)))) {
    const match = read(page).match(FR_LINK);
    if (match) fail(`EN page links to FR page (${match[0]}): ${page}`);
}

// 4. hreflang + canonical on static pages
const pairs = [['index.html', '/', '/en/'], ['apropos/index.html', '/apropos/', '/en/about/'],
    ['projets/index.html', '/projets/', '/en/projects/']];
for (const [page, fr, en] of pairs) {
    for (const file of [page, `${en.slice(1)}index.html`]) {
        if (!existsSync(join(DIST, file))) continue;
        const html = read(file);
        if (!hasHreflang(html, 'fr', SITE + fr)) fail(`missing hreflang fr on ${file}`);
        if (!hasHreflang(html, 'en', SITE + en)) fail(`missing hreflang en on ${file}`);
        if (!hasHreflang(html, 'x-default', SITE + fr)) fail(`missing hreflang x-default on ${file}`);
    }
}

// 5. Fallback EN project pages: banner, canonical → FR, no hreflang
for (const slug of frSlugs.filter((s) => !enSlugs.includes(s))) {
    const file = `en/projects/${slug}/index.html`;
    if (!existsSync(join(DIST, file))) continue;
    const html = read(file);
    if (!html.includes('class="lang-fallback"')) fail(`fallback banner missing: ${file}`);
    if (canonical(html) !== `${SITE}/projets/${slug}/`) fail(`fallback canonical should be FR: ${file} → ${canonical(html)}`);
    if (html.includes('hreflang="en" href=')) fail(`fallback page should not declare hreflang: ${file}`);
}

// 6. Sitemap: contains EN static pages, excludes EN fallback pages
const sitemapFile = readdirSync(DIST).find((f) => /^sitemap-\d+\.xml$/.test(f));
if (!sitemapFile) fail('sitemap-N.xml missing');
else {
    const sitemap = read(sitemapFile);
    if (!sitemap.includes(`${SITE}/en/about/`)) fail('sitemap missing /en/about/');
    for (const slug of frSlugs.filter((s) => !enSlugs.includes(s))) {
        if (sitemap.includes(`${SITE}/en/projects/${slug}/`)) fail(`sitemap lists fallback page /en/projects/${slug}/`);
    }
}

// 7. Language switcher legible: light on the dark burger overlay, inactive language not faded below AA
const css = readFileSync('src/styles/main.css', 'utf8');
const rule = (selector) => css.match(new RegExp(`(^|\\})\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`))?.[2] ?? '';
if (!/color:\s*(#fff\b|#ffffff\b|white)/i.test(rule('.header__main__overlay .lang-switcher__item'))) {
    fail('switcher items not light on the burger overlay');
}
const inactiveOpacity = Number(rule('.lang-switcher__item').match(/opacity:\s*([\d.]+)/)?.[1] ?? 1);
if (inactiveOpacity < 0.75) fail(`inactive switcher language opacity ${inactiveOpacity} < 0.75 (contrast)`);

// 8. CV link lives in the footer, not in the contact section
for (const page of ['index.html', 'en/index.html'].filter((p) => existsSync(join(DIST, p)))) {
    const html = read(page);
    const contact = html.match(/<section class="contact"[\s\S]*?<\/section>/)?.[0] ?? '';
    if (contact.includes('href="/cv/')) fail(`CV link still in contact section: ${page}`);
    if (existsSync('public/cv') && !/class="[^"]*footer__main__tertiary__cv[^"]*"/.test(html)) fail(`CV link missing from footer: ${page}`);
}

// 9. Header switcher is a dropdown (<details>) whose links keep hreflang + lang
for (const page of ['index.html', 'en/about/index.html'].filter((p) => existsSync(join(DIST, p)))) {
    const dropdown = read(page).match(/<details class="lang-switcher[^"]*"[\s\S]*?<\/details>/)?.[0];
    if (!dropdown) fail(`header language dropdown missing: ${page}`);
    else if (!/<a [^>]*hreflang="(fr|en)"[^>]*lang="(fr|en)"/.test(dropdown)) fail(`dropdown links lack hreflang/lang: ${page}`);
}

// 10. EN project files only translate text: every other frontmatter line matches the FR file
const TEXT_FIELDS = /^(title|description1|description2|goal|role|context|challenge|contribution|outcome):/;
const frontmatterWithoutText = (file) => {
    const fm = readFileSync(file, 'utf8').split('---')[1] ?? '';
    const lines = [];
    let inText = false;
    for (const line of fm.split('\n')) {
        if (TEXT_FIELDS.test(line)) { inText = true; continue; }
        if (inText && /^[a-zA-Z0-9]+:/.test(line)) inText = false;
        if (!inText && line.trim()) lines.push(line.trimEnd());
    }
    return lines.join('\n');
};
for (const slug of enSlugs.filter((s) => frSlugs.includes(s))) {
    if (frontmatterWithoutText(join(PROJECTS_DIR, `${slug}.md`)) !== frontmatterWithoutText(join(PROJECTS_DIR, 'en', `${slug}.md`))) {
        fail(`EN frontmatter differs from FR beyond text fields: ${slug}`);
    }
}

// 11. Translated projects: EN canonical is itself, FR page declares the EN alternate, EN page in sitemap
const sitemapXml = sitemapFile ? read(sitemapFile) : '';
for (const slug of enSlugs.filter((s) => frSlugs.includes(s))) {
    const en = `en/projects/${slug}/index.html`;
    if (!existsSync(join(DIST, en))) continue;
    if (canonical(read(en)) !== `${SITE}/en/projects/${slug}/`) fail(`translated EN page canonical not self: ${slug}`);
    if (!hasHreflang(read(`projets/${slug}/index.html`), 'en', `${SITE}/en/projects/${slug}/`)) fail(`FR page lacks EN hreflang: ${slug}`);
    if (!sitemapXml.includes(`${SITE}/en/projects/${slug}/`)) fail(`sitemap missing translated page: ${slug}`);
}
const untranslated = frSlugs.filter((s) => !enSlugs.includes(s));
if (untranslated.length) console.warn(`! projects without EN version (shown as FR fallback): ${untranslated.join(', ')}`);

// 12. Font URLs are root-relative: dev inlines CSS, so "../fonts" would resolve per page (404 on /en/projects/<slug>)
for (const [, url] of css.matchAll(/url\(["']?([^"')]+\.(?:ttf|woff2?|otf))["']?\)/g)) {
    if (!url.startsWith('/')) fail(`font URL not root-relative in main.css: ${url}`);
}

// 13. Case studies: text layout, no gallery unless images, visible in project lists
const caseStudySlugs = frSlugs.filter((s) => /^kind:\s*['"]?case-study/m.test(readFileSync(join(PROJECTS_DIR, `${s}.md`), 'utf8')));
for (const slug of caseStudySlugs) {
    for (const [page, list] of [[`projets/${slug}/index.html`, 'projets/index.html'], [`en/projects/${slug}/index.html`, 'en/projects/index.html']]) {
        if (!existsSync(join(DIST, page))) { fail(`case-study page missing: ${page}`); continue; }
        const html = read(page);
        if (!html.includes('class="caseStudy"')) fail(`case-study layout not used: ${page}`);
        if (html.includes('projectPost__main__secondary__galleryContainer')) fail(`case-study page uses project gallery: ${page}`);
        if (!read(list).includes('card-project--caseStudy')) fail(`case study missing from list: ${list}`);
        const body = readFileSync(join(PROJECTS_DIR, page.startsWith('en/') ? `en/${slug}.md` : `${slug}.md`), 'utf8').split(/^---$/m)[2]?.trim();
        if (body && !html.includes('class="caseStudy__body"')) fail(`case-study markdown body not rendered: ${page}`);
    }
}

// 17. JSON-LD: valid JSON; Person on home; FAQPage on about with one Question per accordion item
const jsonLdOf = (html) => [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => { try { return JSON.parse(m[1]); } catch { return {invalid: true}; } });
for (const page of ['index.html', 'en/index.html', 'apropos/index.html', 'en/about/index.html'].filter((p) => existsSync(join(DIST, p)))) {
    const blocks = jsonLdOf(read(page));
    if (blocks.some((b) => b.invalid)) fail(`invalid JSON-LD: ${page}`);
    const isHome = page.endsWith('index.html') && !page.includes('about') && !page.includes('apropos');
    if (isHome && !blocks.some((b) => b['@type'] === 'Person')) fail(`Person JSON-LD missing: ${page}`);
    if (!isHome) {
        const faqLd = blocks.find((b) => b['@type'] === 'FAQPage');
        const items = (read(page).match(/class="faq__main__item"/g) ?? []).length;
        if (!faqLd) fail(`FAQPage JSON-LD missing: ${page}`);
        else if (faqLd.mainEntity?.length !== items) fail(`FAQPage has ${faqLd.mainEntity?.length} questions, accordion has ${items}: ${page}`);
    }
}

// 14. Homepage sections present in both languages
const HOME_SECTIONS = ['welcome', 'solutions', 'projets', 'experience', 'techStack', 'aboutTeaser', 'contact'];
const REMOVED_SECTIONS = ['whatIDo', 'now'];
for (const page of ['index.html', 'en/index.html'].filter((p) => existsSync(join(DIST, p)))) {
    const html = read(page);
    for (const cls of HOME_SECTIONS) {
        if (!new RegExp(`<section[^>]*class="${cls}[" ]`).test(html)) fail(`homepage section "${cls}" missing: ${page}`);
    }
    for (const cls of REMOVED_SECTIONS) {
        if (new RegExp(`<section[^>]*class="${cls}[" ]`).test(html)) fail(`removed homepage section "${cls}" still present: ${page}`);
    }
}

// 16. No "UI/UX" positioning left in homepage meta
for (const page of ['index.html', 'en/index.html'].filter((p) => existsSync(join(DIST, p)))) {
    const head = read(page).match(/<head>[\s\S]*?<\/head>/)?.[0] ?? '';
    if (/UI\/UX/.test(head.match(/<title>[^<]*|name="description" content="[^"]*"/g)?.join(' ') ?? '')) fail(`"UI/UX" still in meta: ${page}`);
}

// 15. Latest-projects slider: min(6, total) cards, each linking to the same language
const totalEntries = allSlugs.length;
for (const [page, prefix] of [['index.html', '/projets/'], ['en/index.html', '/en/projects/']].filter(([p]) => existsSync(join(DIST, p)))) {
    const html = read(page);
    const slides = [...html.matchAll(/<li class="glide__slide">[\s\S]*?<a href="([^"]+)"/g)].map((m) => m[1]);
    if (slides.length !== Math.min(6, totalEntries)) fail(`slider has ${slides.length} cards, expected ${Math.min(6, totalEntries)}: ${page}`);
    for (const href of slides) if (!href.startsWith(prefix)) fail(`slider card links to other language (${href}): ${page}`);
}

// 18. Revision: original card everywhere, goal/role on project pages, no CV in hero, FAQ teaser, honest meta
for (const [page, about] of [['index.html', 'apropos/index.html'], ['en/index.html', 'en/about/index.html']].filter(([p]) => existsSync(join(DIST, p)))) {
    const html = read(page);
    if (html.includes('card-project__details')) fail(`homepage cards should be the original card (no details block): ${page}`);
    const hero = html.match(/<section class="welcome"[\s\S]*?<\/section>/)?.[0] ?? '';
    if (hero.includes('href="/cv/')) fail(`CV link still in hero: ${page}`);
    const desc = html.match(/name="description" content="([^"]*)"/)?.[1] ?? '';
    if (/Laravel (et|and) WordPress (en production|in production)/.test(desc)) fail(`meta description implies Laravel in production: ${page}`);
    const teaserHtml = html.match(/<section class="aboutTeaser"[\s\S]*?<\/section>/)?.[0] ?? '';
    const teaser = [...teaserHtml.matchAll(/<button class="faq__main__trigger"[^>]*>([^<]*)</g)].map((m) => m[1].trim());
    if (teaser.length !== 4) fail(`about teaser should show 4 FAQ questions, has ${teaser.length}: ${page}`);
    const aboutHtml = existsSync(join(DIST, about)) ? read(about) : '';
    for (const q of teaser) if (!aboutHtml.includes(q)) fail(`teaser question not in FAQ (${q}): ${page}`);
}
for (const page of ['projets/horixt/index.html', 'en/projects/horixt/index.html'].filter((p) => existsSync(join(DIST, p)))) {
    if (!/class="projectPost[a-zA-Z_]*__meta"/.test(read(page))) fail(`goal/role missing on project page: ${page}`);
}
if (!/overflow:\s*visible/.test(rule('.projets__glide .glide__slides'))) fail('slider .glide__slides clips card shadows (needs overflow: visible)');

// 19. Slider cards fill their slide (no big gaps) without distorting the image notch:
//     the clip-path must be pixel-anchored (calc) and cards must not stretch vertically
if (!/width:\s*100%/.test(rule('.projets__glide .glide__slide .card-project'))) fail('slider cards do not fill their slide (big gaps)');
if (!/clip-path:\s*polygon\([^)]*calc\(100% -/.test(css)) fail('card image notch is percentage-based (distorts when the card is wider than 280px)');
if (/align-items:\s*stretch/.test(rule('.projets__glide .glide__slides'))) fail('slider stretches cards vertically');

// 20. Home FAQ teaser reuses the About accordion (same markup/behaviour), first item open
for (const page of ['index.html', 'en/index.html'].filter((p) => existsSync(join(DIST, p)))) {
    const teaser = read(page).match(/<section class="aboutTeaser"[\s\S]*?<\/section>/)?.[0] ?? '';
    const triggers = [...teaser.matchAll(/<button class="faq__main__trigger" aria-expanded="(true|false)"/g)].map((m) => m[1]);
    if (triggers.length !== 4) fail(`FAQ teaser should reuse the accordion with 4 items, has ${triggers.length}: ${page}`);
    else if (triggers[0] !== 'true' || triggers.slice(1).includes('true')) fail(`FAQ teaser: only the first item should be open: ${page}`);
    if (!/data-faq-accordion/.test(teaser)) fail(`FAQ teaser accordion not wired to the shared script: ${page}`);
}
// 21. Burger-menu language switcher uses the site font
if (!/font-family/.test(rule('.lang-switcher--inline'))) fail('inline language switcher (burger menu) has no font-family');

// 22. FAQ icon rotates when its item is open (selector must target the real icon class)
if (!/\.faq__main__trigger\[aria-expanded=(?:"true"|true)\] \.faq__main__icon\s*\{/.test(css)) fail('FAQ open-state icon selector does not target .faq__main__icon');

// 23. Case studies use the shared .tag, external markdown links open in a new tab, no em dash in link text,
//     headers centred (case study) and project meta centred at 500px like the text/picture blocks
for (const slug of caseStudySlugs) {
    for (const [page, list] of [[`projets/${slug}/index.html`, 'projets/index.html'], [`en/projects/${slug}/index.html`, 'en/projects/index.html']]) {
        if (!existsSync(join(DIST, page))) continue;
        const html = read(page);
        if (/__badge/.test(html) || /card-project__badge/.test(read(list))) fail(`custom badge used instead of .tag: ${page}`);
        if (!/<header class="caseStudy__header">[\s\S]*?class="tag tag--/.test(html)) fail(`case-study header lacks the shared .tag: ${page}`);
        const body = html.match(/<section class="caseStudy__body">[\s\S]*?<\/section>/)?.[0] ?? '';
        for (const [a, text] of [...body.matchAll(/(<a [^>]*href="https?:[^"]*"[^>]*>)([^<]*)<\/a>/g)].map((m) => [m[1], m[2]])) {
            if (!/target="_blank"/.test(a) || !/rel="noopener noreferrer"/.test(a)) fail(`external link not opening in a new tab: ${page}`);
            if (/—/.test(text)) fail(`em dash in link text (${text}): ${page}`);
        }
    }
}
if (!/text-align:\s*center/.test(rule('.caseStudy__header'))) fail('case-study header not centred');

// 24. Long card titles (> 14 chars) go down one size
for (const page of ['projets/index.html', 'en/projects/index.html', 'index.html', 'en/index.html'].filter((p) => existsSync(join(DIST, p)))) {
    for (const [, cls, title] of read(page).matchAll(/<h3 class="(card-project__contentContainer__title[^"]*)">\s*([^<]*?)\s*<\/h3>/g)) {
        const long = cls.includes('--long');
        if ((title.length > 14) !== long) fail(`card title "${title}" ${long ? 'wrongly' : 'not'} marked --long: ${page}`);
    }
}

if (failures.length) {
    console.error(`✗ ${failures.length} i18n check(s) failed:\n  - ${failures.join('\n  - ')}`);
    process.exit(1);
}
console.log(`✓ i18n checks passed (${baseline.length} FR pages, ${enPages.length} EN pages)`);
