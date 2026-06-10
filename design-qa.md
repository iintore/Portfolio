# Design QA

Source URL: https://affable-company-306797.framer.app
Implementation URL: http://127.0.0.1:3000
Date: 2026-06-10

## Visual Reference Frames

- Desktop hero: `/Users/tonma/Documents/Codex/2026-06-10/can-you-go-through-this-site/work/site-screens/desktop-0000.png`
- Desktop projects/process/FAQ/contact samples: `/Users/tonma/Documents/Codex/2026-06-10/can-you-go-through-this-site/work/site-screens/desktop-0560.png`, `desktop-3420.png`, `desktop-7200.png`, `desktop-8000.png`
- Mobile hero and long-page samples: `/Users/tonma/Documents/Codex/2026-06-10/can-you-go-through-this-site/work/site-screens/mobile-0000.png`, `mobile-1880.png`, `mobile-5200.png`, `mobile-7600.png`
- Project/detail references: `/Users/tonma/Documents/Codex/2026-06-10/can-you-go-through-this-site/work/site-screens/projects-index.png`, `page-strettchcloudinfra.png`, `page-portfolite.png`, `page-fade.png`, `page-polo.png`

## Implementation Frames

- Desktop hero/projects/lower page: `/Users/tonma/Desktop/Portfolio/qa/local-desktop-0000.png`, `local-desktop-0560.png`, `local-desktop-1160.png`, `local-desktop-7200.png`, `local-desktop-8000.png`
- Mobile hero/page: `/Users/tonma/Desktop/Portfolio/qa/local-mobile-0000.png`, `local-mobile-1880.png`, `local-mobile-5200.png`, `local-mobile-7600.png`
- Routes/CMS: `/Users/tonma/Desktop/Portfolio/qa/local-projects-index.png`, `local-project-strettch.png`, `local-cms.png`, `local-cms-saved.png`
- Interaction upgrade: `/Users/tonma/Desktop/Portfolio/qa/local-morphic-button.png`, `local-project-hover-cursor.png`, `local-project-drawer.png`, `local-cms-story-blocks.png`

## Checks

- Desktop and mobile hero typography, media pills, black CTA, fixed header, soft gray hero surface, and white 3D video treatment match the reference rhythm.
- Homepage sections use the same narrow editorial column, serif section titles, soft cards, blurred section separators, black pill CTAs, grayscale service imagery, FAQ cards, contact form, and oversized footer wordmark.
- Project cards now open a bottom drawer instead of a full project page, per the interaction update. Direct project URLs still resolve and open the drawer.
- Project drawer preserves source content, image crops, metadata, related project cards, and now renders ordered text/image story blocks from the CMS.
- CMS page is intentionally added as a local editing surface and is not part of the public Framer reference UI.
- Framer watermark/edit overlays are intentionally excluded from the owned/local implementation.

## Interaction QA

- Header `Open` scrolls to `#contact`.
- Testimonial carousel next/previous controls change testimonial content.
- FAQ accordion opens/closes individual answers.
- Contact form accepts input and shows `Message Ready` locally without external submission.
- Morphic black buttons match the source gradient/highlight/shadow treatment and animate on hover.
- Project hover shows the custom cursor label `View work`, applies the explicit hover class, scales the card to `matrix(1.008, 0, 0, 1.008, 0, -7)`, and scales the image frame to `matrix(0.986, 0, 0, 0.986, 0, 0)`.
- Project cards open the bottom drawer without changing the current page route.
- Direct project URLs such as `/projects/strettchcloudinfra` return the app and open the drawer client-side.
- Drawer close removes the drawer and unlocks page scrolling.
- `/projects` renders all 4 case studies.
- `/cms` renders ordered story blocks for the selected case study, including `Add Text`, `Add Image`, move, delete, and block type controls.
- `/cms` saves block-based case-study data to `content/case-studies.json` through the local API.
- Premium scroll motion is applied to media via 10 parallax targets on the homepage.
- Browser console errors: none in the tested local flow.

## Build And Hosting QA

- `npm run build` passed.
- Production server tested on port `3001`; `/projects/strettchcloudinfra` returned `200`, and `/api/case-studies` returned 4 case studies with 7 story blocks on the first project.
- Express 5 SPA fallback was patched from `app.get("*")` to an `app.use(...)` fallback.

## Patches Made During QA

- Kept the desktop hero product line and preview pills on one line so the CTA no longer clips into the next section.
- Matched mobile hero behavior to the source by showing one project preview pill, then the location line, paragraph, and CTA in the source rhythm.
- Verified source Strettch copy directly from the Framer route; the Landio wording is present in the reference and retained for fidelity.
- Upgraded CTAs from flat black fills to source-like morphic gradient buttons with layered shadows, highlight sheen, active state, and arrow motion.
- Added custom cursor dot and `View work` label for project card hover, with a matching explicit hover animation class.
- Added scroll/parallax motion targets for hero video, project imagery, skills media, service imagery, and drawer imagery.
- Replaced project full-page opening with a bottom-up project drawer.
- Expanded the CMS model from summary/objective/gallery fields into ordered text/image story blocks.

final result: passed
