import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// Fonction pour convertir "dd-mm-yyyy" en Date
const parseDate = (value: unknown) => {
	if (typeof value === "string") {
		const [day, month, year] = value.split("-").map(Number);
		if (!day || !month || !year) return undefined; // Empêche une mauvaise entrée
		return new Date(year, month - 1, day); // Mois en JS commence à 0 (janvier = 0)
	}
	return value;
};

const projets = defineCollection({
	// Load Markdown and MDX files in the `src/content/projets/` directory (EN versions in `en/`).
	loader: glob({ base: './src/content/projets', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description1: z.string(),
		description2: z.string().optional(),
		image1: z.string(),
		image2: z.string(),
		tag: z.string(),
		heroImage: z.string(),
		urls: z.array(z.string()).optional(),
		tools: z.array(z.string()).optional(),
		gallery: z.array(z.string()).optional(),
		pubDate: z.preprocess(parseDate, z.date()),
		updatedDate: z.coerce.date().optional(),
	}),
});

export const collections = { projets };
