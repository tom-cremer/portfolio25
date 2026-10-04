import type {L10n} from './l10n.ts';

export interface StackItem {
    name: string;
    familiar?: boolean; // notions de base
}

export interface StackGroup {
    title: L10n;
    items: StackItem[];
}

export const stack: StackGroup[] = [
    {title: {fr: 'Back-end', en: 'Back-end'}, items: [{name: 'PHP'}, {name: 'Laravel'}, {name: 'WordPress'}, {name: 'MySQL'}, {name: 'Python'}]},
    {title: {fr: 'Front-end', en: 'Front-end'}, items: [{name: 'HTML'}, {name: 'Sass'}, {name: 'JavaScript'}, {name: 'TypeScript'}, {name: 'Astro'}]},
    {
        title: {fr: 'DevOps & outils', en: 'DevOps & tools'},
        items: [{name: 'Git'}, {name: 'Kubernetes', familiar: true}, {name: 'Caddy', familiar: true}],
    },
    {title: {fr: 'J\'apprends', en: 'Learning'}, items: [{name: 'React'}, {name: 'Next.js'}, {name: 'SEO'}]},
];
