---
kind: 'case-study'
title: 'Portfolio V2'
tag: 'Web'
goal: 'Remplacer mon premier portfolio WordPress par un site statique bilingue, simple à faire évoluer et à déployer.'
role: 'Conception, développement et mise en ligne du site.'
context: 'Ma première version de portfolio reposait sur un thème WordPress fait maison. Pour un site essentiellement composé de contenu, c''était une base lourde à maintenir, et je voulais aussi le proposer en anglais.'
challenge: 'Passer en anglais sans dupliquer chaque page, sans pages vides quand une traduction manque et sans pénaliser le référencement. Le tout avec une mise en ligne qui ne dépend pas d''une manipulation à la main.'
contribution:
  - 'Migration vers Astro: un site statique généré au build, sans base de données ni CMS à maintenir.'
  - 'Une content collection typée qui distingue deux formats: les projets classiques et les études de cas comme celle-ci.'
  - 'Une i18n FR/EN: si un contenu n''est pas traduit, la page anglaise affiche la version française avec un avertissement, un lien canonical vers l''original et sans entrer dans le sitemap.'
  - 'Un script qui vérifie le build: présence de chaque page dans les deux langues, attribut lang, liens canonical et hreflang.'
  - 'Un déploiement via GitHub Actions déclenché par un tag, uniquement si le commit est sur main, puis envoyé en FTPS vers l''hébergement.'
  - 'Des données structurées JSON-LD pour la FAQ et des statistiques de visite avec Umami.'
outcome: 'Le site est en ligne en français et en anglais. Ajouter un projet revient à écrire un fichier Markdown par langue, et publier une nouvelle version se fait en poussant un tag.'
tools:
  - 'Astro'
  - 'TypeScript'
  - 'Sass'
  - 'GitHub Actions'
pubDate: '10-10-2026'
---
