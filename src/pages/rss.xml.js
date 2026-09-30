import rss from '@astrojs/rss';
import {getCollection} from 'astro:content';
import {SITE_TITLE} from '../consts';
import {ui} from '../i18n/ui';
import {localizeEntries} from '../i18n/localize';
import {localizePath} from '../i18n/utils';

export async function GET(context) {
	const projects = localizeEntries(await getCollection('projets'), 'fr');
	return rss({
		title: SITE_TITLE,
		description: ui.fr['meta.home.description'],
		site: context.site,
		items: projects.map(({entry, slug}) => ({
			title: entry.data.title,
			description: entry.data.description1,
			pubDate: entry.data.pubDate,
			link: `${localizePath('projects', 'fr', slug)}/`,
		})),
	});
}
