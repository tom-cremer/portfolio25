// Dictionnaire des textes de l'interface. Les clés finissant par "Html" contiennent du balisage (set:html).
export const languages = {fr: 'Français', en: 'English'} as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'fr';

const fr = {
    // Meta
    'meta.home.title': 'Tom Cremer – Développeur Back-end & Full-stack | Portfolio',
    'meta.home.description': 'Tom Cremer, développeur back-end et full-stack en Belgique. WordPress en production, applications Laravel, projets web et mobiles.',
    'meta.about.title': 'À propos – Tom Cremer, Développeur Back-end & Full-stack',
    'meta.about.description': 'Découvrez Tom Cremer, développeur back-end et full-stack en Belgique : parcours, passions et réponses aux questions fréquentes.',
    'meta.projects.title': 'Projets – Tom Cremer, Développeur Back-end & Full-stack',
    'meta.projects.description': 'Les projets et études de cas de Tom Cremer, développeur back-end et full-stack en Belgique : applications Laravel, sites WordPress, application mobile Flutter.',
    'meta.project.titleSuffix': '– Projet | Tom Cremer',

    // Navigation
    'seo.jobTitle': 'Développeur Back-end & Full-stack',
    'home.hero.tagline': 'Développeur Back-end · Full-stack',
    'home.hero.intro': 'J\'aime quand la logique derrière un site est aussi soignée que son interface.',
    'home.hero.ctaProjects': 'Voir mes projets',
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
    'contact.titleHtml': 'Un poste,<br> un projet&nbsp;?',
    'contact.text': 'Parlons-en !',
    'contact.button': 'Me contacter',

    // Home
    'home.heroAlt': 'Personnage cartoon ressemblant à Tom Cremer',
    'home.projects.all': 'Tous les projets',
    'home.projects.allTitle': 'Vers page Projets',
    'home.projects.title': 'Projets récents',
    'home.projects.prev': 'Projet précédent',
    'home.projects.next': 'Projet suivant',
    'home.projects.slide': 'Aller au projet {n}',

    // Projects
    'home.experience.title': 'Expérience & formation',
    'home.experience.education': 'Formation',
    'home.stack.title': 'Mes outils',
    'home.stack.familiar': 'notions',
    'home.editorial.title': 'Solide côté serveur, soigné côté écran',
    'home.editorial.subtitle': 'Mon approche',
    'home.editorial.textHtml': '<p>Je m\'occupe surtout du back-end : logique métier, données, intégrations. J\'aime autant comprendre pourquoi un site fonctionne que le rendre agréable à utiliser — et j\'apprends chaque jour, en équipe comme sur mes projets perso.</p>',
    'home.about.faqTitle': 'Questions fréquentes',
    'home.about.faqAll': 'Voir toute la FAQ',
    'home.about.title': 'En dehors du code',
    'home.about.text': 'J\'aime comprendre comment les choses fonctionnent sous le capot : c\'est ce qui m\'attire vers le back-end. En dehors du code, je fais de l\'athlétisme et de la photographie.',
    'home.about.more': 'En savoir plus',
    'projects.title': 'Mes Projets',
    'project.imageAlt': 'Illustration du projet {title}',
    'project.gallery': 'Galerie',
    'project.website': 'Website',
    'project.fallbackNotice': 'Ce projet n\'est disponible qu\'en français pour le moment.',
    'home.projects.caseStudy': 'Étude de cas',
    'home.projects.goal': 'Objectif',
    'home.projects.role': 'Mon rôle',
    'caseStudy.note': 'Projet réalisé chez EPIC',
    'caseStudy.context': 'Contexte',
    'caseStudy.challenge': 'Enjeu',
    'caseStudy.contribution': 'Ma contribution',
    'caseStudy.stack': 'Stack',
    'caseStudy.outcome': 'Résultat',
    'caseStudy.more': 'Pour aller plus loin',

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
    'meta.home.title': 'Tom Cremer – Back-end & Full-stack Developer | Portfolio',
    'meta.home.description': 'Tom Cremer, back-end and full-stack developer based in Belgium. WordPress in production, Laravel applications, web and mobile projects.',
    'meta.about.title': 'About – Tom Cremer, Back-end & Full-stack Developer',
    'meta.about.description': 'Get to know Tom Cremer, back-end and full-stack developer in Belgium: background, passions and answers to frequently asked questions.',
    'meta.projects.title': 'Projects – Tom Cremer, Back-end & Full-stack Developer',
    'meta.projects.description': 'Projects and case studies by Tom Cremer, back-end and full-stack developer in Belgium: Laravel applications, WordPress sites, a Flutter mobile app.',
    'meta.project.titleSuffix': '– Project | Tom Cremer',

    'seo.jobTitle': 'Back-end & Full-stack Developer',
    'home.hero.tagline': 'Back-end · Full-stack Developer',
    'home.hero.intro': 'I like the logic behind a site to be as polished as its interface.',
    'home.hero.ctaProjects': 'See my projects',
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

    'contact.titleHtml': 'A role,<br> a project?',
    'contact.text': 'Let\'s talk!',
    'contact.button': 'Get in touch',

    'home.heroAlt': 'Cartoon character resembling Tom Cremer',
    'home.projects.all': 'All projects',
    'home.projects.allTitle': 'Go to the Projects page',
    'home.projects.title': 'Recent work',
    'home.projects.prev': 'Previous project',
    'home.projects.next': 'Next project',
    'home.projects.slide': 'Go to project {n}',

    'home.experience.title': 'Experience & education',
    'home.experience.education': 'Education',
    'home.stack.title': 'My tools',
    'home.stack.familiar': 'basics',
    'home.editorial.title': 'Solid on the server, polished on screen',
    'home.editorial.subtitle': 'My approach',
    'home.editorial.textHtml': '<p>I mostly work on the back-end: business logic, data, integrations. I care as much about why a site works as about making it pleasant to use — and I keep learning every day, in a team and on my own projects.</p>',
    'home.about.faqTitle': 'Frequently asked',
    'home.about.faqAll': 'See the full FAQ',
    'home.about.title': 'Beyond the code',
    'home.about.text': 'I like understanding how things work under the hood — that\'s what draws me to the back-end. Away from the keyboard, I do athletics and photography.',
    'home.about.more': 'Learn more',
    'projects.title': 'My Projects',
    'project.imageAlt': 'Illustration of the {title} project',
    'project.gallery': 'Gallery',
    'project.website': 'Website',
    'project.fallbackNotice': 'This project is only available in French for now.',
    'home.projects.caseStudy': 'Case study',
    'home.projects.goal': 'Goal',
    'home.projects.role': 'My role',
    'caseStudy.note': 'Work delivered at EPIC',
    'caseStudy.context': 'Context',
    'caseStudy.challenge': 'Challenge',
    'caseStudy.contribution': 'My contribution',
    'caseStudy.stack': 'Stack',
    'caseStudy.outcome': 'Outcome',
    'caseStudy.more': 'Going further',

    'about.title': 'A bit more than code!',
    'about.photoAlt': 'Photo of Tom Cremer at athletics',
    'about.p1': 'Hola, I\'m Tom, a back-end developer with a taste for challenges, whether behind my keyboard or on the athletics track!',
    'about.p2': 'I guess if you\'re here reading this, you want to learn more about me… You little rascals 😉',
    'about.p3': 'Jokes aside, what I love about the web is being able to create, without limits, sites that are as impressive visually as they are logically — and above all, that they\'re accessible anywhere, anytime. That\'s just magic!',
    'about.p4Html': 'My motto? <i>“Records are made to be broken”</i> — Robert Downey Jr, aka Iron Man. A line that sums up my outlook: always trying to go further, to improve, and to push my own limits.',
    'about.faq.title': 'FAQ',
};

export const ui: Dictionary = {fr, en};
