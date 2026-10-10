---
kind: 'case-study'
title: 'Portfolio V2'
tag: 'Web'
goal: 'Replace my first WordPress portfolio with a bilingual static site that is simple to evolve and deploy.'
role: 'Design, development and release of the site.'
context: 'My first portfolio ran on a home-made WordPress theme. For a site that is mostly content, it was a heavy base to maintain, and I also wanted it available in English.'
challenge: 'Add English without duplicating every page, without empty pages when a translation is missing and without hurting SEO. All with a release process that doesn''t rely on manual steps.'
contribution:
  - 'Moved to Astro: a static site generated at build time, with no database or CMS to maintain.'
  - 'A typed content collection with two formats: regular projects and case studies like this one.'
  - 'FR/EN i18n: when content isn''t translated, the English page shows the French version with a notice, a canonical link to the original, and stays out of the sitemap.'
  - 'A script that checks the build: every page exists in both languages, with the right lang attribute, canonical and hreflang links.'
  - 'Deployment with GitHub Actions, triggered by a tag, only if the commit is on main, then uploaded over FTPS to the host.'
  - 'JSON-LD structured data for the FAQ and visit analytics with Umami.'
outcome: 'The site is live in French and English. Adding a project means writing one Markdown file per language, and releasing a new version means pushing a tag.'
tools:
  - 'Astro'
  - 'TypeScript'
  - 'Sass'
  - 'GitHub Actions'
pubDate: '10-10-2026'
---
