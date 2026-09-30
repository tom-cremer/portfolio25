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

// https://astro.build/config
export default defineConfig({
	site: SITE,
	i18n: {
		defaultLocale: 'fr',
		locales: ['fr', 'en'],
		routing: {prefixDefaultLocale: false},
	},
	integrations: [mdx(), sitemap({filter: (page) => !fallbackPages.has(page)})],
});
