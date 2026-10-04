// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import {existsSync, readdirSync} from 'node:fs';

const SITE = 'https://tomcremer.be';
const PROJECTS_DIR = './src/content/projets';
const slugsIn = (dir) => existsSync(dir)
	? readdirSync(dir).filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, ''))
	: [];
const translated = new Set(slugsIn(`${PROJECTS_DIR}/en`));
// Pages EN de repli (contenu FR) : canonique = page FR, donc hors sitemap.
const fallbackPages = new Set(slugsIn(PROJECTS_DIR).filter((s) => !translated.has(s))
	.map((s) => `${SITE}/en/projects/${s}/`));

// Liens externes du Markdown : ouverture dans un nouvel onglet
const rehypeExternalLinks = () => (tree) => {
	const visit = (node) => {
		if (node.type === 'element' && node.tagName === 'a' && /^https?:\/\//.test(String(node.properties?.href ?? ''))) {
			node.properties.target = '_blank';
			node.properties.rel = ['noopener', 'noreferrer'];
		}
		node.children?.forEach(visit);
	};
	visit(tree);
};

// https://astro.build/config
export default defineConfig({
	site: SITE,
	i18n: {
		defaultLocale: 'fr',
		locales: ['fr', 'en'],
		routing: {prefixDefaultLocale: false},
	},
	markdown: {
		rehypePlugins: [rehypeExternalLinks],
	},
	integrations: [mdx(), sitemap({filter: (page) => !fallbackPages.has(page)})],
});
