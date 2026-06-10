# Tony Lewis MANZI Portfolio

Local recreation of the Framer portfolio at `https://affable-company-306797.framer.app`, with Framer-inspired motion, project drawers, a custom project-hover cursor, and a file-backed case-study CMS.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## CMS

Open `http://127.0.0.1:3000/cms`.

The CMS edits `/content/case-studies.json`. Use it to add, duplicate, delete, feature, and edit case studies. Each case study has a story feed made from ordered text and image blocks, so you can add sections such as introduction, problem treatment, outcome, and images between paragraphs.

Image paths should point to files in `/public/assets`, for example `/assets/project-strettch.png`.

## Project Interaction

Project cards open a bottom drawer instead of navigating to a full page. Direct URLs such as `http://127.0.0.1:3000/projects/strettchcloudinfra` still work and open the matching drawer over the projects index.

## Production

```bash
npm run build
npm run start
```

The Node server serves the built site and keeps the CMS API available. Static-only hosting will show the portfolio, but it will not support CMS saves unless you also host the Node server.

## QA

See `design-qa.md` for the visual, interaction, CMS, and production routing checks.
