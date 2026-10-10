---
kind: 'case-study'
title: 'GitLab inventory'
tag: 'Backend'
company: 'EPIC'
goal: 'Get an overview of the projects hosted on EPIC''s GitLab, to audit them and plan their migrations.'
role: 'Designed and developed the tool, from parsing GitLab to the search interface.'
context: 'EPIC''s GitLab holds around 1,200 projects. Knowing which ones are websites, which are legacy or which GitLab CI version they use meant opening the projects one by one.'
challenge: 'Calling the GitLab API for every file of every project would have multiplied the requests across around 1,200 projects. The whole set had to be parsed once, kept usable and kept up to date without rerunning everything by hand.'
contribution:
  - 'Parsed each project by checking for specific files to classify it: website or not, legacy or not, GitLab CI version, npm and Composer packages.'
  - 'Cached the results in an SQL database to limit calls to the GitLab API.'
  - 'Built a decorator-based analysis layer that hydrates each project''s data to produce its audit, stored as JSON.'
  - 'Wrote a custom Kernel that runs a job parsing GitLab to keep the inventory up to date.'
  - 'Built the interface with FlightPHP and a custom SCSS template (media queries, components).'
  - 'Built a search filter that combines criteria and accepts an operator syntax to query the audit JSON directly.'
outcome: 'The inventory is used to audit projects and plan migrations. A full GitLab scan with the audit takes around 1 to 1.5 hours.'
tools:
  - 'PHP'
  - 'FlightPHP'
  - 'MySQL'
  - 'GitLab API'
  - 'Sass'
pubDate: '10-10-2026'
---

Processing happens in two steps. **Parsing** walks through GitLab and spots, for each project, the files that characterise it; the result is cached in the database. **Hydration** then passes each project through a series of decorators, each adding its part of the audit (CMS and its version, CI, dependencies…). The final audit is a JSON object stored in the database.

The search filter went through several iterations. On top of the usual combinable filters (project type, legacy, CI version, npm and Composer packages), it accepts `field:` tokens that target a path in the audit JSON:

```
field:$.cms.wordpress.version=6.4
field:$.cms.wordpress.version==6.4.3
field:$.cms.wordpress.version>=6.1 field:$.cms.wordpress.version<=6.9
field:$.app.font.isFont
```

The `=` operator compares versions segment by segment: `6.4` matches every 6.4.x version without mixing it up with `6.40`. A single search can then find every site still on a given WordPress version, before planning its update.
