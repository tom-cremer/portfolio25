import type {L10n} from './l10n.ts';

export interface Job {
    role: L10n;
    company: string;
    contract: L10n;
    start: string; // 'YYYY-MM'
    end?: string;  // 'YYYY-MM' — à renseigner à la fin du contrat
    bullets: L10n[];
    stack: string[];
}

export interface Education {
    title: L10n;
    period: L10n;
    school: L10n;
}

export const jobs: Job[] = [
    {
        role: {fr: 'Développeur Back-end', en: 'Back-end Developer'},
        company: 'EPIC',
        contract: {fr: 'CDI', en: 'Permanent contract'},
        start: '2025-10',
        bullets: [
            {
                fr: 'Maintenance et évolution de sites WordPress en production, au sein d\'une équipe de trois développeurs (lead, senior et moi).',
                en: 'Maintaining and extending production WordPress sites in a team of three developers (lead, senior and me).',
            },
            {fr: 'Mises à jour et monitoring des sites.', en: 'Updating and monitoring the sites.'},
            {
                fr: 'Ajout de champs et de données côté back-end à la demande de l\'équipe front-end.',
                en: 'Adding back-end fields and data requested by the front-end team.',
            },
            {
                fr: 'Workflow Git au quotidien, configuration de déploiement avec Kubernetes (Kustomize) et Caddy (notions).',
                en: 'Daily Git workflow, deployment configuration with Kubernetes (Kustomize) and Caddy (basics).',
            },
        ],
        stack: ['PHP', 'WordPress', 'Git', 'Kubernetes', 'Kustomize', 'Caddy'],
    },
];

export const education: Education[] = [
    {
        title: {fr: 'Techniques Infographiques', en: 'Computer Graphics Techniques'},
        period: {fr: '2022 - 2025 | Diplôme de fin d\'études', en: '2022 - 2025 | Bachelor\'s degree'},
        school: {
            fr: 'Bachelier en techniques infographiques, Spécialisation Web - Haute École de la Province de Liège',
            en: 'Bachelor in Computer Graphics Techniques, Web specialization - Haute École de la Province de Liège',
        },
    },
    {
        title: {fr: 'Techniques Transition', en: 'Technical Transition Track'},
        period: {fr: '2020 - 2022 | Obtention CESS', en: '2020 - 2022 | Secondary school diploma (CESS)'},
        school: {
            fr: 'Troisième cycle secondaire en transition, Option Informatique - Saint Jean-Berchmans',
            en: 'Upper secondary education, Computer Science option - Saint Jean-Berchmans',
        },
    },
    {
        title: {fr: 'Techniques Transition', en: 'Technical Transition Track'},
        period: {fr: '2018 - 2020', en: '2018 - 2020'},
        school: {
            fr: 'Deuxième cycle secondaire en transition, Option Informatique - École Polytechniques de Seraing',
            en: 'Middle secondary education, Computer Science option - École Polytechnique de Seraing',
        },
    },
];
