---
kind: 'case-study'
title: 'Apple Wallet pass'
tag: 'Backend'
goal: 'Let a client''s users add their card to Apple Wallet, straight from the client''s website.'
role: 'Technical research and back-end development of the pass generation.'
context: 'An EPIC client wanted to offer its users a card they could add to Apple Wallet. That''s the topic I took on, from reading the documentation to a working pass.'
challenge: 'The .pkpass format is strict: an archive holding a precise pass.json, its images, a manifest with the hash of every file, and a signature made with an Apple certificate. A single mistake and the iPhone rejects the card, with no explicit error.'
contribution:
  - 'Studied the Apple Wallet documentation: pass structure, field types, required images and signing rules.'
  - 'Generated the .pkpass file server-side in PHP: pass.json, a manifest.json with the SHA-1 hash of each file, then zipped into an archive.'
  - 'Signed the manifest with OpenSSL, using the Pass Type ID certificate and Apple''s WWDR intermediate certificate.'
  - 'Checked the generated passes with a .pkpass viewer before testing on an iPhone.'
  - 'Researched Apple''s web service to keep the cards'' data in sync after they are installed.'
outcome: 'The pass is delivered to the client: its users can add their card to Apple Wallet. The web-service research lays the groundwork for updating the cards automatically.'
tools:
  - 'PHP'
  - 'OpenSSL'
pubDate: '01-10-2026'
---

Once it's installed on an iPhone, a card doesn't update by itself. To keep its data in sync, Apple provides a **web service**: the `pass.json` declares a `webServiceURL` and an `authenticationToken`, and the device then registers with the server. When the data changes, the server sends a push notification (APNs); the iPhone then asks for the list of updated passes and downloads their latest version.

I studied how this works (device registration, notifications, fetching the updated pass) to prepare automatic syncing of the cards. It isn't in place yet.

**Resources**

- [Apple Developer: Wallet Passes](https://developer.apple.com/documentation/walletpasses)
- [Apple Developer: Adding a web service to update passes](https://developer.apple.com/documentation/walletpasses/adding-a-web-service-to-update-passes)
- [WalletWallet: PKPass viewer](https://walletwallet.alen.ro/blog/pkpass-viewer/)
