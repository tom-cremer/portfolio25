import type {L10n} from './l10n.ts';

// Questions fréquentes de /apropos. Les réponses peuvent contenir du HTML et les variables {age} / {years}.
// Ajouter une entrée ici met à jour l'accordéon ET le JSON-LD FAQPage.
export interface FaqItem {
    q: L10n;
    a: L10n;
    teaser?: boolean; // affichée sur la page d'accueil
}

// Variables des réponses ({age}, {years})
export const faqVars = () => {
    const year = new Date().getFullYear();
    return {age: year - 2004, years: year - 2022};
};

export const faq: FaqItem[] = [
    {
        q: {fr: "Depuis combien de temps tu codes ?", en: "How long have you been coding?"},
        a: {fr: "Je code depuis que j'ai 16 ans ({age} ans actuellement), j'ai commencé avec arduino puis j'ai appris python ensuite j'ai découvert le web…", en: "I've been coding since I was 16 ({age} years old now). I started with Arduino, then learned Python, and then discovered the web…"},
        teaser: true,
    },
    {
        q: {fr: "Que fais-tu quand tu ne codes pas ?", en: "What do you do when you're not coding?"},
        a: {fr: "J'ai deux principaux passe temps, l'athlétisme et les jeux vidéos - Décompresser sur la piste est essentiels après une journée de code&nbsp;!", en: "I have two main hobbies: athletics and video games. Unwinding on the track is essential after a day of coding!"},
        teaser: true,
    },
    {
        q: {fr: "Ton film préféré ?", en: "Your favorite movie?"},
        a: {fr: "Ouf. Il y en a plein, mais si je dois en choisir qu'un ce serait, <em>The Wild Robot</em>", en: "Phew. There are so many, but if I had to pick just one it would be <em>The Wild Robot</em>"},
    },
    {
        q: {fr: "Team Café ou Thé ?", en: "Team Coffee or Tea?"},
        a: {fr: "Team Thé, avec deux petits carrés de sucre ou si j'ai le choix une bonne cuillère de miel", en: "Team Tea, with two little sugar cubes — or, if I get to choose, a good spoonful of honey"},
    },
    {
        q: {fr: "Quel sont tes trois jeux du moment ?", en: "What are your top three games right now?"},
        a: {fr: "En ce moment, je joue principalement à Cult of the Lamb, Elite: Dangerous et évidemment Hollow Knight: Silksong", en: "Right now I'm mostly playing Cult of the Lamb, Elite: Dangerous and, of course, Hollow Knight: Silksong"},
    },
    {
        q: {fr: "Front-end ou Back-end ? (Et pourquoi ?)", en: "Front-end or Back-end? (And why?)"},
        a: {fr: "Le but serait de faire Full-stack, mais à choisir je penche plus sur le Back-end, pourquoi, parce que j'aime bien me creuser la tête, de plus j'aime la logique&nbsp;!", en: "The goal is to be full-stack, but if I had to choose I lean towards the back-end — because I like racking my brain, and I love logic!"},
        teaser: true,
    },
    {
        q: {fr: "Ton éditeur de code préféré ?", en: "Your favorite code editor?"},
        a: {fr: "<em>PHPStorm</em>&nbsp;! Il n'y a pas de débat, il y a tout, c'est une mine d'outils, {years} ans que je l'utilise et je n'ai pas encore fini d'en apprendre sur lui&nbsp;!", en: "<em>PHPStorm</em>! No debate — it has everything, it's a goldmine of tools. I've been using it for {years} years and I'm still learning new things about it!"},
        teaser: true,
    },
];
