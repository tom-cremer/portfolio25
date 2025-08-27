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

// Fonction pour formater la date en "dd Mois yyyy" avec majuscule
const formatDate = (date: Date) => {
	const formatted = date.toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});

	return formatted.replace(/\b(\p{Letter})/u, (c) => c.toUpperCase()); // Forcer la majuscule
};

const projets = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/projets', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		tag: z.string(),
		heroImage: z.string(),
		url: z.string().url().optional(),
		gallery: z.array(z.string()).optional(),
		pubDate: z.preprocess(parseDate, z.date()).transform(formatDate),
		updatedDate: z.coerce.date().optional(),
	}),
});

export const collections = { projets };
