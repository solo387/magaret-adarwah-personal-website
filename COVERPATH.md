# Coverpath

Coverpath is a React/Vite Power Apps Code App starter for an independent health-insurance agent. It provides a prospect pipeline, CSV import/export, campaign planning, reviewed outreach drafts, and booking-response prompts.

## Run locally

```bash
npm install
npm run dev
```

`npm run dev` runs the Vite app and a loopback-only local API together. After `npm run build`, `npm run preview` runs the production preview with the same local API. Use `npm run lint` for ESLint and `npm test` for unit tests.

## What works now

- New workspaces start empty. Optional demo records are fictional and use reserved `example.com` email addresses.
- Lead records, stages, opt-out flags, campaign name and goal, signature details, and the optional booking URL are stored in this browser's local storage. Opted-out email addresses are also kept in a separate local suppression list so deleting a lead does not make the address eligible again. They do not sync to other devices, and there is no user sign-in or server-side backup. If saving lead changes or settings fails, the app warns that those changes are only in memory and may be lost when the page closes or reloads.
- Lead search, stage filters, adding/deleting leads, opt-out suppression, CSV import/export, campaign-plan drafts, signature editing, and booking-response copy are functional. Opt-out suppression is one-way in the interface; an opted-out lead cannot be re-enabled for outreach with an accidental click. CSV exports prefix spreadsheet formula-leading values with a text marker and remove that marker when importing the app's own exports. Exported pipeline stages are restored on import; older CSVs without a stage default to `New`.
- Automatic company research uses a server-side Brave Search API key configured in Setup. It searches for U.S. companies matching the industry, region, and employer-size criteria, then silently scans up to five candidate public HTTPS sites. It respects each site's `robots.txt`, follows same-site contact/about/team links, and checks at most five pages per site. Automatic search results include only generic company inboxes (such as HR, benefits, or contact) whose email domain matches the company site; it excludes social-network and personal profile sites and does not return individual email addresses or names. Each result shows the business website and source page; the agent must review it before saving.
- The manual website scanner remains available for a specific user-entered public HTTPS company URL. It can identify published contacts on that site, so use only business contact information that is appropriate and authorized for the intended purpose. Neither scanner signs in, bypasses access controls, or sends email.
- Contact names are associated with emails when the public page explicitly links a person's name to the address, provides matching nearby name context, or publishes a Schema.org `Person` record containing both. These are unverified candidates, not identity verification. Review a result to open the existing lead form with the company, contact candidate, email, and source prefilled; verify the information before saving. Generic company inboxes are not assigned a person's name, and results are never automatically added to leads.
- The scanner is a local development service bound to `127.0.0.1`; it blocks IP/private-network targets, non-HTTPS URLs, cross-site redirects, oversized pages, and requests from non-local app origins. A production deployment needs a separately hosted, authenticated scanning service with equivalent SSRF, robots, access, and privacy protections; the local scanner must not be exposed to the internet.
- CSV imports accept `company`, `contact`, and `email` columns, with optional `state`, `employees`, `source`, `status` (or `stage`), and `unsubscribed` fields. Duplicate addresses and invalid rows are skipped and reported; imported opt-outs and previously suppressed addresses stay excluded from draft selection.
- When configured, live AI drafting sends only the selected prospect's name and company, agency and signature details, outreach goal, and optional booking URL to the configured server-side chat-completions service. No lead email, employee count, state, or health information is sent to that AI endpoint. The user must affirm this disclosure before each live draft request. If no AI service is configured, the app labels and uses its local draft template instead; failures from a configured provider are surfaced and never silently replaced with a template.
- Outlook sending uses Microsoft Entra delegated sign-in and Microsoft Graph `Mail.Send`; app credentials remain public client IDs only, and access tokens are held in session storage by MSAL. The user must review the draft, click Send, and confirm. Successful Graph acceptance is not proof of delivery. Opening an Outlook compose window remains available as an alternative.
- Booking responses are prompts to copy; no meeting is booked automatically.

## Client-use limitation

This is **not ready for storing a real client prospect list**: lead records still use browser local storage and have no authentication, governed cloud database, shared access, or server backup. Browser local storage is not an appropriate production CRM for personal contact information. The app deliberately starts empty; do not load real leads until the production data source, access policies, retention, and client environment have been configured and reviewed.

## Configure local integrations

1. Copy `.env.example` to `.env.local`. The repository ignores `*.local`.
2. In Microsoft Entra, register a Single-page application; add the exact app origin as its redirect URI and grant delegated `Mail.Send`. In Coverpath Setup, enter that registration's public Application (client) ID and Directory (tenant) ID or verified tenant domain, save, and select Connect Outlook. Those identifiers are stored in this browser only; no client secret is needed. Optional `VITE_ENTRA_CLIENT_ID` and `VITE_ENTRA_TENANT_ID` build variables can preconfigure the public IDs.
3. For live drafting, open Setup and enter the provider's HTTPS chat-completions endpoint, deployment/model name, API key, and authentication header. For automatic company search, create a Brave Search API key and enter it in the same Setup dialog. The loopback API writes the secrets server-side into the ignored `.env.local`; secrets are not returned to the browser. Restarting the app loads the saved settings. Azure-compatible endpoints use `api-key`; bearer-token services use `Authorization`. Search provider usage may incur charges and is subject to its plan and terms.
4. Outlook, AI, and search settings in this local app are intended only for a trusted development computer. The server API binds to loopback; do not expose it to a LAN or the internet. The keys are stored as plaintext in `.env.local`, protected only by the local account and file permissions. Do not configure them on a shared computer.
5. If running the local app on a non-default port, set `COVERPATH_APP_ORIGIN` to that exact `http://localhost:<port>` or `http://127.0.0.1:<port>` origin so the loopback API accepts only that local app.

These steps enable local development integrations only. The API and website scanner bind to loopback and are not production services. **This project is not production-ready and must not be deployed for client use as-is.** Production requires a hosted, authenticated HTTPS backend with managed secret storage, identity and authorization, safe origin/CSRF controls, monitoring, rate limits, and approved mail/AI configuration. Production also needs a persistent governed data store, tenant-specific permissions, retention/deletion policies, operational monitoring, security/privacy review, and end-to-end tests in the client's tenant.

## Shared client CRM still needs setup

The app does not implement Dataverse or another shared CRM integration. There is no environment selector, CRM connector, synchronization, conflict handling, or server-side lead persistence. Manual lead entry and CSV import are available, but are not a substitute for a governed CRM. The client must provide an approved Power Platform environment, authorized connection, approved Dataverse table and field mapping, and privacy/access policies before that integration can be built and tested. **Do not store real client prospect data in this local build.**

The app uses direct Microsoft Graph calls only after delegated Microsoft sign-in, and sends AI requests to the explicitly configured local server endpoint. These are not Power Platform connectors. Dataverse and Copilot Studio are not configured. A static production build does not include a production API or scanning backend.
