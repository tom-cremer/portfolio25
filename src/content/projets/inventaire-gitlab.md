---
kind: 'case-study'
title: 'Inventaire GitLab'
tag: 'Backend'
company: 'EPIC'
goal: 'Avoir une vue d''ensemble des projets hébergés sur le GitLab d''EPIC pour les auditer et planifier leurs migrations.'
role: 'Conception et développement de l''outil, du parsing du GitLab jusqu''à l''interface de recherche.'
context: 'Le GitLab d''EPIC compte environ 1200 projets. Savoir lesquels sont des sites, lesquels sont legacy ou quelle version de GitLab CI ils utilisent demandait d''ouvrir les projets un par un.'
challenge: 'Interroger l''API GitLab pour chaque fichier de chaque projet aurait multiplié les appels sur environ 1200 projets. Il fallait parser l''ensemble une seule fois, garder le résultat exploitable et le tenir à jour sans tout relancer à la main.'
contribution:
  - 'Parsing de chaque projet en cherchant la présence de certains fichiers pour le classer: site ou non, legacy ou non, version de GitLab CI, packages npm et Composer.'
  - 'Mise en cache des résultats en base SQL pour limiter les appels à l''API GitLab.'
  - 'Une couche d''analyse à base de décorateurs qui hydrate les données de chaque projet pour produire son audit, stocké en JSON.'
  - 'Un Kernel maison qui lance un job de parsing du GitLab pour garder l''inventaire à jour.'
  - 'Une interface en FlightPHP avec un template SCSS sur mesure (media queries, composants).'
  - 'Un filtre de recherche qui combine les critères et accepte une syntaxe à opérateurs pour interroger directement le JSON d''audit.'
outcome: 'L''inventaire sert à auditer les projets et à planifier les migrations. Un scan complet du GitLab avec l''audit prend environ 1h à 1h30.'
tools:
  - 'PHP'
  - 'FlightPHP'
  - 'MySQL'
  - 'GitLab API'
  - 'Sass'
pubDate: '10-10-2026'
---

Le traitement se fait en deux temps. Le **parsing** parcourt le GitLab et repère, pour chaque projet, les fichiers qui le caractérisent; le résultat est mis en cache en base. L'**hydratation** passe ensuite chaque projet dans une série de décorateurs, chacun ajoutant sa partie de l'audit (CMS et sa version, CI, dépendances…). L'audit final est un objet JSON stocké en base.

Le filtre de recherche a demandé plusieurs adaptations. En plus des filtres classiques combinables (type de projet, legacy, version de CI, packages npm et Composer), il accepte des tokens `field:` qui ciblent un chemin dans le JSON d'audit:

```
field:$.cms.wordpress.version=6.4
field:$.cms.wordpress.version==6.4.3
field:$.cms.wordpress.version>=6.1 field:$.cms.wordpress.version<=6.9
field:$.app.font.isFont
```

L'opérateur `=` compare les versions segment par segment: `6.4` matche toutes les versions 6.4.x, sans confondre avec `6.40`. On peut ainsi retrouver en une recherche tous les sites encore sur une version donnée de WordPress, avant de planifier leur mise à jour.
