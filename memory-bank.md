# Coverpath — Memory Bank

## Project

- Path: `C:\Users\babas\OneDrive\Desktop\Insurance agent app`
- App name: Coverpath
- Environment ID: Not provided; Power Platform initialization and deployment are pending.
- App URL: Not deployed.

## Completed

- [x] Checked Node.js v24.18.1 and Git v2.55.0.
- [x] Scaffolded the Microsoft Power Apps Vite template and installed dependencies.
- [x] Implemented a responsive lead workspace, campaign outline, local outreach draft preview, and booking response templates.
- [x] Added local persistence for campaign name, signature details, and booking link; implemented validated CSV import/export and opt-out suppression.
- [x] Changed new workspaces to start empty; added optional fictional samples and an Outlook Web compose handoff for reviewed drafts.
- [x] Added documentation and privacy/compliance notes.
- [x] Added local public website scanning: checks robots.txt and scans at most five same-site HTTPS pages for publicly published email addresses, nearby context, and likely names on mailto links.
- [x] Added a review-before-save lead form handoff with the contact details and public source URL prefilled; contacts are not automatically added or contacted.
- [x] Added SSRF protections (HTTPS-only, public IPv4 resolution, redirect restrictions, private network blocking, page size/time limits) and scanner unit tests.
- [x] Added a delegated Microsoft Entra/MSAL + Microsoft Graph `Mail.Send` path. Users explicitly sign in, review, and confirm each send; the app does not claim delivery.
- [x] Added a Setup form for an administrator to save public Entra client/tenant IDs in browser storage; sign-in config is validated and can be changed without rebuilding the app.
- [x] Added an opt-in live AI drafting API on the loopback Node service. Provider keys remain server-side in `.env.local`; requests are validated, time-limited, and return explicit errors rather than template-shaped success responses.
- [x] Added `.env.example`, administrator setup steps, and tests for AI payload validation, unconfigured-service behavior, and local-origin restrictions.
- [ ] Production hosting still needs an authenticated scanner service with equivalent protections; the local scanner is bound to loopback and is not suitable for internet exposure.
- [ ] Initialize in a Power Platform environment.
- [ ] Have the client administrator create an Entra SPA registration, add the deployed app origin, and grant delegated `Mail.Send`; enter the registration IDs in Setup. No client registration IDs have been provided, so Outlook sign-in is not yet authorized.
- [ ] Add the client's governed Dataverse connection and replace local-storage lead persistence (no environment ID, connection, or table is available).
- [ ] Verify authenticated connector behavior and deploy after user approval.

## Current data and integrations

- Leads, preferences, campaign name, signature details, and booking link are stored in browser local storage only; not suitable for a production client database.
- New workspaces start empty; optional sample data uses reserved `example.com` addresses.
- Outlook can send through Microsoft Graph after Entra SPA configuration and user sign-in. A send requires a reviewed draft and confirmation; Microsoft Graph acceptance is not proof of delivery.
- Live AI uses the server-only chat-completions URL, API key, and model configured in `.env.local`. The user consents before each request. Without server configuration the interface explicitly falls back to a labeled local template.
- Lead data is still browser-local. No Dataverse connection, client environment, or shared CRM is configured; real prospect data must not be loaded into this workspace.
- Web research uses user-initiated Bing search links and a local scanner backend started with `npm run dev` or `npm run preview`. The scanner checks robots.txt and scans only a small number of same-site pages for public business contact information.
- Do not enter health information, protected health information, policy numbers, or other sensitive personal information.

## Next steps

1. Configure the client-approved Entra SPA registration and delegated Outlook permission; enter only the public client/tenant IDs in Setup (or preconfigure optional `VITE_ENTRA_CLIENT_ID`/`VITE_ENTRA_TENANT_ID` build variables).
2. Configure the client-approved AI endpoint and server-side API key in `.env.local`; verify provider retention and privacy terms before using prospect details.
3. Obtain the client environment ID and authorized Dataverse connection; replace browser persistence with an approved shared table before using real leads.
4. Host an authenticated production backend, complete access/privacy/security checks, and deploy only after explicit approval.
