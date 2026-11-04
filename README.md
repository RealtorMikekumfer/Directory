# Kumfer Home Directory

A new mobile-first home-services directory for Michael Kumfer, eXp Realty. Original provider data imported intact from robert827d-coder/KumferHomeDirectory. No dependency install or build required.

## Files you will edit

- **dist/providers_clean.json**: the list of providers. This is the one source of truth.
- **dist/config.json**: Michael's contact details and GitHub repository name.
- **dist/editor.html**: a form-based directory manager. Create a draft, download JSON, then replace dist/providers_clean.json in GitHub and commit.

The editor is a local draft tool, not a password-protected admin backend. Visitors cannot publish changes; GitHub controls who can change the real list. Browser drafts stay on the device. There are no tokens or passwords in the app.

## Your client link

https://realtormikekumfer.github.io/Directory/

The client directory and manager load **dist/providers_clean.json** directly from this public GitHub repository when opened or refreshed. Commit list changes here, then refresh the client link. GitHub caching can take a few minutes. No new client link or app redeployment is needed for provider-list changes.

If GitHub is temporarily unreachable, the public directory shows the bundled copy with a visible notice. The manager requires the current GitHub list before editing, to avoid replacing newer data with an old copy.

Code, design and contact configuration changes publish automatically through the GitHub Pages workflow after a commit to main. Provider-list changes are also read directly from the repository.

## GitHub Pages hosting\n\nGitHub Pages is enabled with GitHub Actions as its source. The **Check and publish directory** workflow validates each change to main and deploys the dist folder. The public app runs independently of ChatGPT and requires no visitor sign-in.\n\nRequested branded Short.io link: `https://kumfer.me/Directory`. Its Short.io destination still needs to be connected to the GitHub Pages URL above. Existing Short.io links and IONOS DNS should be preserved.\n\n## Updating providers throughout your career

Open the directory → Manage directory. Edit or add providers. Download the list. Open your GitHub repository, replace dist/providers_clean.json and commit. Or edit that JSON file directly in GitHub. Refresh the client link after committing; allow a few minutes for GitHub caching. The repository workflow checks each change and deploys GitHub Pages automatically.

Fields: Company, Contact, email, number, Main Location, Category, Specialty, Service_Area, Testimonial, Rating. Existing categories are preserved. Handyman and insurance are surfaced as separate filters when identified in a company name. New categories are picked up automatically.

Rating is preserved for migration but is not displayed as a public review score. Original notes are shown as directory notes, not verified reviews. One original phone entry uses the reserved 555-01xx block; the app suppresses its tap-to-call link until corrected. No provider details have been independently verified.

## Local validation

Run `node scripts/check.mjs`. Serve dist with any static HTTP server. The app fetches JSON, so open it over HTTP rather than as a file URL.

## Features

Responsive layout; bundled Bookman editorial typography with Nimbus Sans; service filters; multi-word search; A–Z/service sorting; bookmarks saved on the visitor's device; contact detail dialogs; shareable contact deep links; vCard downloads; tap-to-call/email; directory manager with JSON import/export.

Bundled typefaces: URW Base35; see dist/fonts/LICENSE.txt. Keep that license with redistributed font files.
