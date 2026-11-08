# Ablaze Financial Consulting

A responsive, interactive single-page website for Ablaze Financial Consulting LLC, including a privacy-friendly conversation guide, printable topic checklists, a visitor-controlled video, and accessible FAQs.

The hero pairs personal insurance guidance with Margaret's portrait, layered 3D orbit accents, and pointer-responsive motion. The rest of the page uses staggered 3D scroll animations and interactive service cards. Reduced-motion preferences disable ambient animation; no build step is required.

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server. For example:

```powershell
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploy to Firebase Hosting

The Firebase Hosting configuration serves Vite's production output from `dist`. Build and deploy with the Firebase CLI:

```powershell
npm ci
npm run build
npx firebase-tools deploy --only hosting
```

The site includes the business logo hosted by the existing Ablaze website, a locally optimized WebP portrait, a filterable gallery of team meetings and seminar photos with an accessible full-size photo viewer, and locally hosted event videos, including a portrait-format recording of Margaret presenting at a seminar. Videos have matching posters and controls, and do not autoplay.

It also provides email, phone, WhatsApp, and LinkedIn links. Visitors can print or save their selected conversation questions as a PDF. Email links help visitors request a conversation; no appointment scheduler, contact form, or analytics service is configured. The site does not collect personal details, and visitors are asked not to email sensitive information.

The repository also contains Coverpath's local development tooling and documentation in [COVERPATH.md](./COVERPATH.md); it is separate from this public-facing website.
