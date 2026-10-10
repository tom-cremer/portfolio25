---
kind: 'case-study'
title: 'Carte Apple Wallet'
tag: 'Backend'
goal: 'Permettre aux utilisateurs d''un client d''ajouter leur carte dans Apple Wallet, directement depuis son site.'
role: 'Recherche technique et développement back-end de la génération du pass.'
context: 'Un client d''EPIC souhaitait proposer à ses utilisateurs une carte à ajouter dans Apple Wallet. C''est le sujet sur lequel je me suis penché, de la documentation jusqu''au pass fonctionnel.'
challenge: 'Le format .pkpass est strict: une archive contenant un pass.json précis, ses images, un manifeste des empreintes de chaque fichier et une signature réalisée avec un certificat Apple. Une seule erreur et l''iPhone refuse la carte, sans message explicite.'
contribution:
  - 'Étude de la documentation Apple Wallet: structure du pass, types de champs, images attendues et règles de signature.'
  - 'Génération du fichier .pkpass côté serveur en PHP: pass.json, manifest.json avec les empreintes SHA-1 des fichiers, puis compression en archive.'
  - 'Signature du manifeste avec OpenSSL, à partir du certificat Pass Type ID et du certificat intermédiaire WWDR d''Apple.'
  - 'Vérification des passes générés avec un visualiseur .pkpass, avant les tests sur iPhone.'
  - 'Recherche sur le web service d''Apple pour garder les données des cartes synchronisées après leur installation.'
outcome: 'Le pass est livré au client: ses utilisateurs peuvent ajouter leur carte à Apple Wallet. La recherche sur le web service pose les bases d''une mise à jour automatique des cartes.'
tools:
  - 'PHP'
  - 'OpenSSL'
pubDate: '01-10-2026'
---

Une fois installée sur l'iPhone, une carte ne se met pas à jour toute seule. Pour garder ses données synchronisées, Apple prévoit un **web service**: le `pass.json` déclare une `webServiceURL` et un `authenticationToken`, puis l'appareil s'enregistre auprès du serveur. Quand les données changent, le serveur envoie une notification push (APNs) ; l'iPhone demande alors la liste des passes modifiés et télécharge leur dernière version.

J'ai étudié ce fonctionnement (enregistrement des appareils, notifications, récupération du pass à jour) pour préparer la synchronisation automatique des cartes. Il n'est pas encore mis en place.

**Ressources**

- [Apple Developer: Wallet Passes](https://developer.apple.com/documentation/walletpasses)
- [Apple Developer: Adding a web service to update passes](https://developer.apple.com/documentation/walletpasses/adding-a-web-service-to-update-passes)
- [WalletWallet: PKPass viewer](https://walletwallet.alen.ro/blog/pkpass-viewer/)
