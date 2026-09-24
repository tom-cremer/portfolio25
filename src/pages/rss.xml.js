import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

// pubDate est formaté en "dd Mois yyyy" par le schéma, on le reconvertit en Date
const toDate = (formatted) => {
	const [day, month, year] = formatted.split(' ');
	return new Date(Number(year), MONTHS.indexOf(month.toLowerCase()), Number(day));
};

export async function GET(context) {
	const posts = await getCollection('projets');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			pubDate: toDate(post.data.pubDate),
			link: `/projets/${post.id}/`,
		})),
	});
}
