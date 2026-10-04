// Dictionnaire des textes de l'interface. Les clés finissant par "Html" contiennent du balisage (set:html).
export const languages = {fr: 'Français', en: 'English'} as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'fr';

const fr = {
    // Meta
    'meta.home.title': 'Tom Cremer – Développeur Full-Stack & UI/UX | Portfolio',
    'meta.home.description': 'Tom Cremer, développeur full-stack et UI/UX designer en Belgique. Création de sites et applications web sur mesure avec Laravel, PHP, Astro et JavaScript.',
    'meta.about.title': 'À propos – Tom Cremer, Développeur Full-Stack',
    'meta.about.description': 'Découvrez Tom Cremer, développeur full-stack et UI/UX designer en Belgique : parcours, passions et réponses aux questions fréquentes.',
    'meta.projects.title': 'Projets – Tom Cremer, Développeur Full-Stack',
    'meta.projects.description': 'Les projets web de Tom Cremer, développeur full-stack en Belgique : sites, applications et designs réalisés avec Laravel, Astro, Flutter et plus.',
    'meta.project.titleSuffix': '– Projet | Tom Cremer',

    // Navigation
    'nav.home': 'Accueil',
    'nav.projects': 'Projets',
    'nav.about': 'A Propos',
    'nav.contact': 'Contact',
    'nav.menuTitle': 'Menu Principal',
    'nav.burgerTitle': 'Burger Menu',
    'lang.switch': 'Changer de langue',

    // Footer
    'footer.madeWith': 'Fait avec 💛, par Tom Cremer',
    'footer.rights': '© {year} Tom Cremer. Tous droits réservés.',
    'footer.phone': 'Téléphone',
    'footer.email': 'Email',
    'footer.cv': 'Télécharger mon CV',

    // Contact
    'contact.titleHtml': 'Une idée,<br> Un projet&nbsp;?',
    'contact.text': 'Parlons-en !',
    'contact.button': 'C\'est parti !',

    // Home
    'home.jobs.1': 'UI/UX Designer',
    'home.jobs.2': 'Développeur Web',
    'home.welcome': 'Hey, ravi de pouvoir vous accueillir sur mon portfolio !',
    'home.heroAlt': 'Personnage cartoon ressemblant à Tom Cremer',
    'home.solutions.title': 'Solutions Créatives & Modernes',
    'home.solutions.subtitle': 'Qu’est-ce que j’apporte ?',
    'home.solutions.text': 'Chaque projet est une nouvelle occasion d\'apprendre, d\'innover et de perfectionner mon savoir-faire. Curieux et passionné, je mets mes compétences à votre service pour créer des solutions sur mesure, adaptées à vos besoins.',
    'home.stats.experience': 'Expérience',
    'home.stats.years': 'Ans',
    'home.stats.projects': 'Projets',
    'home.stats.completed': 'Achevés',
    'home.projects.all': 'Tous les projets',
    'home.projects.allTitle': 'Vers page Projets',
    'home.projects.text': 'Voici une sélection de projets !',
    'home.tools.title': 'Mes Outils',
    'home.timeline.title': 'Mon Parcours',
    'home.timeline.1.title': 'Techniques Infographiques',
    'home.timeline.1.date': '2022 - 2025 | Diplôme de fin d\'études',
    'home.timeline.1.text': 'Bachelier en techniques infographiques, Spécialisation Web - Haute École de la Province de Liège',
    'home.timeline.2.title': 'Techniques Transition',
    'home.timeline.2.date': '2020 - 2022 | Obtention CESS',
    'home.timeline.2.text': 'Troisième cycle secondaire en transition, Option Informatique - Saint Jean-Berchmans',
    'home.timeline.3.title': 'Techniques Transition',
    'home.timeline.3.date': '2018 - 2020',
    'home.timeline.3.text': 'Deuxième cycle secondaire en transition, Option Informatique - École Polytechniques de Seraing',

    // Projects
    'projects.title': 'Mes Projets',
    'project.imageAlt': 'Illustration du projet {title}',
    'project.gallery': 'Galerie',
    'project.website': 'Website',
    'project.fallbackNotice': 'Ce projet n\'est disponible qu\'en français pour le moment.',

    // About
    'about.title': 'Un peu plus que du code !',
    'about.photoAlt': 'Photo de Tom Cremer à l\'athlétisme',
    'about.p1': 'Holà, moi c\'est Tom, développeur back-end avec un goût pour les défis, que ce soit derrière mon clavier ou sur la piste d\'athlétisme !',
    'about.p2': 'Je suppose que si vous êtes là, en train de lire ceci c\'est que vous voulez en apprendre plus sur moi… Bande de coquins va 😉',
    'about.p3': 'Blague à part, ce qui me passionne dans le web c\'est de pouvoir créer et sans aucune limite des sites tout aussi incroyables visuellement que logiquement, et surtout que ces sites soient accessibles partout et à n\'importe quel moment c\'est juste magique !',
    'about.p4Html': 'Ma devise ? <i>“Les records sont faits pour être battus”</i> — Robert Downey Jr, alias Iron Man. Une phrase qui résume bien ma vision : toujours chercher à aller plus loin, à progresser, et à repousser mes propres limites.',
    'about.faq.title': 'FAQ',
} as const;

export type UIKey = keyof typeof fr;
export type Dictionary = { fr: Record<UIKey, string>; en: Partial<Record<UIKey, string>> };

const en: Partial<Record<UIKey, string>> = {
    'meta.home.title': 'Tom Cremer – Full-Stack Developer & UI/UX | Portfolio',
    'meta.home.description': 'Tom Cremer, full-stack developer and UI/UX designer based in Belgium. Custom websites and web applications built with Laravel, PHP, Astro and JavaScript.',
    'meta.about.title': 'About – Tom Cremer, Full-Stack Developer',
    'meta.about.description': 'Get to know Tom Cremer, full-stack developer and UI/UX designer in Belgium: background, passions and answers to frequently asked questions.',
    'meta.projects.title': 'Projects – Tom Cremer, Full-Stack Developer',
    'meta.projects.description': 'Web projects by Tom Cremer, full-stack developer in Belgium: websites, applications and designs built with Laravel, Astro, Flutter and more.',
    'meta.project.titleSuffix': '– Project | Tom Cremer',

    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.menuTitle': 'Main menu',
    'nav.burgerTitle': 'Mobile menu',
    'lang.switch': 'Change language',

    'footer.madeWith': 'Made with 💛 by Tom Cremer',
    'footer.rights': '© {year} Tom Cremer. All rights reserved.',
    'footer.phone': 'Phone',
    'footer.email': 'Email',
    'footer.cv': 'Download my CV',

    'contact.titleHtml': 'An idea,<br> A project?',
    'contact.text': 'Let\'s talk!',
    'contact.button': 'Let\'s go!',

    'home.jobs.1': 'UI/UX Designer',
    'home.jobs.2': 'Web Developer',
    'home.welcome': 'Hey, glad to welcome you to my portfolio!',
    'home.heroAlt': 'Cartoon character resembling Tom Cremer',
    'home.solutions.title': 'Creative & Modern Solutions',
    'home.solutions.subtitle': 'What do I bring?',
    'home.solutions.text': 'Every project is a new chance to learn, innovate and sharpen my craft. Curious and passionate, I put my skills to work for you to build tailored solutions that fit your needs.',
    'home.stats.experience': 'Experience',
    'home.stats.years': 'Years',
    'home.stats.projects': 'Projects',
    'home.stats.completed': 'Completed',
    'home.projects.all': 'All projects',
    'home.projects.allTitle': 'Go to the Projects page',
    'home.projects.text': 'Here\'s a selection of projects!',
    'home.tools.title': 'My Tools',
    'home.timeline.title': 'My Journey',
    'home.timeline.1.title': 'Computer Graphics Techniques',
    'home.timeline.1.date': '2022 - 2025 | Bachelor\'s degree',
    'home.timeline.1.text': 'Bachelor in Computer Graphics Techniques, Web specialization - Haute École de la Province de Liège',
    'home.timeline.2.title': 'General Technical Track',
    'home.timeline.2.date': '2020 - 2022 | Secondary school diploma (CESS)',
    'home.timeline.2.text': 'Upper secondary education, Computer Science option - Saint Jean-Berchmans',
    'home.timeline.3.title': 'General Technical Track',
    'home.timeline.3.date': '2018 - 2020',
    'home.timeline.3.text': 'Middle secondary education, Computer Science option - École Polytechnique de Seraing',

    'projects.title': 'My Projects',
    'project.imageAlt': 'Illustration of the {title} project',
    'project.gallery': 'Gallery',
    'project.website': 'Website',
    'project.fallbackNotice': 'This project is only available in French for now.',

    'about.title': 'A bit more than code!',
    'about.photoAlt': 'Photo of Tom Cremer at athletics',
    'about.p1': 'Hola, I\'m Tom, a back-end developer with a taste for challenges, whether behind my keyboard or on the athletics track!',
    'about.p2': 'I guess if you\'re here reading this, you want to learn more about me… You little rascals 😉',
    'about.p3': 'Jokes aside, what I love about the web is being able to create, without limits, sites that are as impressive visually as they are logically — and above all, that they\'re accessible anywhere, anytime. That\'s just magic!',
    'about.p4Html': 'My motto? <i>“Records are made to be broken”</i> — Robert Downey Jr, aka Iron Man. A line that sums up my outlook: always trying to go further, to improve, and to push my own limits.',
    'about.faq.title': 'FAQ',
};

export const ui: Dictionary = {fr, en};
