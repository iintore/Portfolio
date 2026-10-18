// Every piece of copy and every image slot on the page lives here.
// All text is neutral placeholder copy, sized to roughly the same length as the
// slot it fills so line breaks and section heights stay close to the reference
// layout. Images point at generated stand-ins with the same pixel dimensions.
// Replace everything in this file with your own content.

export const site = {
  title: "Portfolio",
  firstName: "TONY",
  lastName: "LEWIS",
  avatar: "/brand/avatar.webp",
  email: "hello@example.com",
  location: "KIGALI, RWANDA",
  tagline: "CREATE > CONSUME",
  copyright: "© 2026 Tony Lewis",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" as const },
    { label: "Behance", href: "https://www.behance.net/", icon: "behance" as const },
  ],
  nav: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about-me" },
    { label: "Resume", href: "/resume" },
  ],
};

export const hero = {
  greeting: "👋 Hey, I'm ",
  greetingName: "Tony",
  line1: "product",
  line2: "designer",
  currently: "Building consumer & enterprise products @",
  company: { name: "IST Group", logo: "/brand/ist-badge.png" },
  figure: "hero-figure", // media pipeline name (media/hero-figure.webp)
};

// `accent` marks the word set in the script face and tinted blue once revealed.
export const whatIDo = {
  label: "WHAT I DO",
  statement: [
    "I", "turn", "messy,", "real-world", "problems", "into", "products", "people", "actually",
    { text: "understand", accent: true }, "—", "interfaces", "that", "feel", "obvious,", "systems", "that", "scale,",
    "and", "details", "that", "quietly", "do", "the", "work.",
  ] as (string | { text: string; accent: true })[],
  stats: [
    { value: 6, suffix: "+", title: "Years designing", body: "consumer products, enterprise software & design systems" },
    { value: 9, suffix: "M+", title: "Users", body: "reached by the products I've helped ship at IST Group." },
  ],
};

export const work = {
  label: "SELECTED WORK",
  title: "check out some of my work",
  body: "A few products I've helped shape, and the thinking behind them.",
  projects: [
    {
      number: "01",
      year: "2025",
      title: "Project one headline goes on these lines",
      tags: ["Tag one", "Tag two"],
      body: "Two or three lines summarising the project: the problem, your role, and the outcome. Keep it short so the card stays balanced.",
      image: "/placeholders/project-1.png",
      imageBox: { left: 436, top: 37, width: 1214, height: 864 },
      mobileImageBox: { left: -169, top: 435.5, width: 619, height: 441 },
      cta: { kind: "primary" as const, label: "View Case Study", href: "/case-study" },
    },
    {
      number: "02",
      year: "2026",
      title: "Project two headline sits across two lines",
      tags: ["Tag one", "Longer tag two", "Tag three"],
      body: "Two or three lines summarising the project: the problem, your role, and the outcome. Keep it short so the card stays balanced.",
      image: "/placeholders/project-2.png",
      imageBox: { left: 436, top: 37, width: 1214, height: 864 },
      mobileImageBox: { left: -93, top: 434.4, width: 577, height: 411 },
      cta: { kind: "soon" as const, label: "Coming Soon", href: "" },
    },
    {
      number: "03",
      year: "2024",
      title: "Project three headline wraps onto a second line",
      tags: ["Tag one", "Tag two", "Tag three"],
      body: "Two or three lines summarising the project: the problem, your role, and the outcome. Keep it short so the card stays balanced.",
      image: "/placeholders/project-3.png",
      imageBox: { left: 735, top: 136, width: 1075, height: 765 },
      mobileImageBox: { left: -93, top: 434.4, width: 577, height: 411 },
      cta: { kind: "soon" as const, label: "Coming Soon", href: "" },
      secondary: { label: "View in Playstore", href: "https://example.com" },
    },
  ],
};

export const about = {
  label: "ABOUT ME",
  title: "a little about myself",
  paragraphs: [
    "First paragraph of your bio. Use it to explain how you got into design, what shaped your taste early on, and the kinds of projects that taught you the most along the way. Mention the tools you started with, the people you made things for, and the habits you still carry today. Five lines at this width keeps the column level with the photo.",
    "Second paragraph: what you work on today, the problems you enjoy most, and the kinds of teams you like to build with. Close with what you are looking for next and how people can get in touch. Four lines at this width is about right for this block.",
  ],
  signature: "Tony.",
  photo: "/placeholders/about.webp",
};

export const journey = {
  label: "EXPERIENCE",
  title: "the journey so far",
  body: "One line summarising your career so far — the industries, the roles, and the time span.",
  // ordered left → right on the timeline; `pill` places the date above or below the line
  roles: [
    {
      pill: "top" as const, current: true, dates: ["Jan '25 -", "Present"],
      title: "Role title", company: "Company A", location: "Your City, ST", logo: "/placeholders/exp-1.png",
      points: [
        "First responsibility or achievement in this role, written out in full so it wraps across four lines at this card width.",
        "Second point: a project you led, who it was for, and the measurable result it produced once it shipped to people.",
        "Third point: a team, system or process you improved while you were there and how that changed the work.",
      ],
    },
    {
      pill: "bottom" as const, dates: ["Jun '24 - Dec '24"],
      title: "Previous role title", company: "Company A", location: "Your City, ST", logo: "/placeholders/exp-1.png",
      points: [
        "First responsibility or achievement in this role, written out so it wraps across about four lines here.",
        "Second point describing a project you owned, from early concepts through to validation.",
        "Third point about who you collaborated with and the impact the work had on daily use.",
      ],
    },
    {
      pill: "top" as const, dates: ["Jan '24 - May '24"],
      title: "Internship title", company: "Company B", location: "Your City, ST", logo: "/placeholders/exp-2.png",
      points: [
        "First responsibility or achievement in this internship, written so it runs across four lines.",
        "Second point describing a launch you supported and what it made possible.",
      ],
    },
    {
      pill: "bottom" as const, dates: ["May '23 - Aug '23"],
      title: "Internship title", company: "Company C", location: "Other City, ST", logo: "/placeholders/exp-3.png",
      points: [
        "First responsibility or achievement in this role, written out so it wraps across about four lines here.",
        "Second point describing the products or platforms you designed for and their users.",
        "Third point about who you partnered with and what improved across core workflows.",
      ],
    },
  ],
};

export const testimonials = {
  label: "RECOMMENDATIONS",
  title: "what people say about me",
  body: "A few words from people I've designed with, shipped alongside, and problem-solved next to.",
  items: [
    {
      name: "Jordan Lee", role: "Role title @ Company", photo: "/placeholders/person-1.webp", tall: false,
      quote: "Placeholder recommendation. Paste a quote from a colleague or client here. A longer quote like this one fills most of the paper card, wrapping across eight or nine lines in the handwritten face, which is roughly what the layout was designed around. Keep the length similar so the card proportions hold.",
    },
    {
      name: "Samira Okafor Lindqvist", role: "Role title, Company", photo: "/placeholders/person-2.webp", tall: true,
      quote: "Placeholder recommendation. A medium-length quote sits in the middle of the card and leaves some breathing room above and below it.",
    },
    {
      name: "Priya Raman", role: "Role title, Company name", photo: "/placeholders/person-3.webp", tall: false,
      quote: "Placeholder recommendation. A quote of six or seven lines works well here: enough to say something specific about working together without crowding the card.",
    },
  ],
};

export const contact = {
  lead: "lets",
  cycle: ["design", "build", "create"],
  line2: "incredible work together.",
  emailLabel: "Email",
  socialLabel: "Social",
  // clip in the tilted card (muted, looping) and its first frame; empty video shows a gradient
  video: "/media/deal-done-645868aa5c.mp4",
  poster: "/media/deal-done-645868aa5c-poster.webp",
  bigWord: "TONY",
};

export const resume = {
  label: "RESUME",
  title: "oh sure, let's keep it formal",
  body: ["For recruiters, hiring managers, and anyone who prefers", "the short version."],
  download: { label: "Download", href: "/resume.pdf" },
  sheet: "/placeholders/resume-sheet.png",
};

// Case-study page template. Every string is placeholder copy; every image is a
// generated stand-in at the original slot size. Duplicate this object to add
// more case studies.
const lorem2 = "Two or three sentences that set up this part of the story: what you saw, why it mattered, and what you decided to do about it.";
const lorem3 = "A slightly longer paragraph for this block. Explain the reasoning behind the decision, the constraints you were working within, and what changed for users once it shipped. Keep it to four or five lines at this width.";
const screen = (n: number) => `/placeholders/screen-${((n - 1) % 6) + 1}.png`;

export const caseStudy = {
  tags: ["Tag one", "Tag two"],
  title: "Case study headline across two lines",
  intro: "One or two lines summarising the project: what changed, for whom, and the headline result you can point to.",
  meta: [
    { k: "Role", v: "Your role" },
    { k: "Platform", v: "iOS & Android" },
    { k: "Status", v: "Live", live: true },
    { k: "Year", v: "2026" },
  ],
  heroMedia: "/placeholders/bento-wide.png",
  context: {
    label: "CONTEXT",
    title: "why this project mattered",
    paragraphs: [lorem2, lorem3, lorem2],
    stats: [
      { v: "4M+", k: "First headline metric about scale" },
      { v: "900K+", k: "Second metric, such as monthly volume" },
      { v: "40–50%", k: "Share of feedback pointing at the problem" },
      { v: "3", k: "Partners or systems the work had to span" },
    ],
  },
  problems: [
    { t: "First pain point in a few words", b: lorem2 },
    { t: "Second pain point, short", b: "Two sentences describing this problem and how often people ran into it." },
    { t: "Third pain point headline", b: lorem2 },
    { t: "Fourth pain point", b: "Two sentences describing this problem and why it blocked growth." },
  ],
  problemMedia: "/placeholders/screen-1.png",
  voices: {
    title: "in their own words…",
    body: "One short paragraph introducing the research quotes below: where they came from and what pattern kept showing up across them.",
    note: "A one-line source note for the quotes, e.g. where they were collected and how they were anonymised.",
    quotes: [
      { q: "“A short user quote that captures the frustration in a sentence or two.”", n: "Participant A", r: "Context · Segment" },
      { q: "“A one-line quote with a concrete detail.”", n: "Participant B", r: "Context · Segment" },
      { q: "“Another single-line quote about the same issue.”", n: "Participant C", r: "Context · Segment" },
      { q: "“A quote about what people wanted instead, in a couple of lines.”", n: "Participant D", r: "Context · Segment" },
    ],
  },
  goals: {
    label: "GOALS",
    title: "what we set out to do",
    body: "One or two lines framing the goals below and how they were weighed against each other.",
    notes: ["“A question the team kept asking, written by hand?”", "“A second open question on a sticky note?”", "“A third question that framed the work?”"],
    cards: [
      { t: "First goal stated as an outcome", b: "Two short lines explaining how you would know this goal was met." },
      { t: "Second goal stated as an outcome", b: "Three short lines explaining the business reason for this goal and how it would be measured." },
      { t: "Third goal stated as an outcome", b: "Two short lines explaining how this goal scaled beyond the first release." },
    ],
  },
  decisions: {
    label: "APPROACH",
    title: "key product decisions",
    body: "One or two lines on how you worked through the decisions before designing screens.",
    items: [
      { t: "First principle in a short line", b: "Three or four lines explaining the principle, the tradeoff it involved and why you landed where you did." },
      { t: "Second principle in a short line", b: "Three or four lines explaining the principle, the tradeoff it involved and why you landed where you did." },
      { t: "Third principle that runs a little longer", b: "Three or four lines explaining the principle, the tradeoff it involved and why you landed where you did." },
      { t: "Fourth principle, brief", b: "Three lines explaining this principle and the safeguard you added." },
    ],
  },
  journey: {
    label: "THE NEW FLOW",
    title: "the complete\nend-to-end flow",
    body: "Two or three lines introducing the screens below and how they fit together into one journey.",
    screens: [1, 2, 3, 4, 5, 6].map((n) => ({ img: screen(n), caption: "One line captioning what this screen does." })),
  },
  features: [
    { label: "MOMENT ONE", title: "first feature headline\nacross two lines", body: "Three lines describing the change and what it replaced.", note: ["Why this matters.", " One or two lines tying it back to the research."], media: "/placeholders/bento-square.png" },
    { label: "MOMENT TWO", title: "second feature headline", body: "Three lines describing the change and what it replaced.", note: ["The decision.", " One or two lines on the tradeoff you chose."], media: "/placeholders/bento-square.png" },
    { label: "MOMENT THREE", title: "third feature headline", body: "Three lines describing the change and what it replaced.", note: ["Why this matters.", " One or two lines tying it back to the research."], media: "/placeholders/bento-square.png" },
    { label: "MOMENT FOUR", title: "fourth feature headline\nacross two lines", body: lorem3 + " " + lorem2, media: "/placeholders/bento-square.png" },
  ],
  after: {
    label: "AFTER THE ACTION",
    title: "what happens next",
    body: "Two or three lines on the states that follow the main action — success, pending, failure — and how each one was handled.",
    media: "/placeholders/bento-wide.png",
    screens: [4, 5, 6].map((n) => screen(n)),
  },
  beforeAfter: {
    label: "HISTORY",
    title: "from raw logs to\na readable history",
    body: "Two or three lines introducing the before and after comparison below.",
    items: [
      { tag: "BEFORE", img: screen(2), caption: "One or two lines on what was wrong before." },
      { tag: "AFTER", img: screen(3), caption: "One or two lines on what improved." },
    ],
  },
  outcome: {
    label: "OUTCOME",
    title: "the results",
    body: "Two or three lines on how the work rolled out and how impact was measured before a wider launch.",
    stats: [
      { dir: "down" as const, v: "14%", t: "First result metric", b: "Two or three lines explaining what moved and why it matters." },
      { dir: "up" as const, v: "12%", t: "Second result metric", b: "Two or three lines explaining what moved and why it matters." },
      { dir: "up" as const, v: "11%", t: "Third result metric", b: "Two or three lines explaining what moved and why it matters." },
    ],
  },
  reflections: {
    title: "reflections & learnings",
    points: [
      "A lesson about where the biggest impact really came from. Write two or three lines here so the note fills out the way the finished case study will, naming the change that mattered most.",
      "A lesson about understanding the existing system before changing it. Two or three lines on what you learned by studying why things worked the way they did before the redesign.",
      "A shorter lesson about timing or sequencing, written in roughly two lines so the rhythm of the list stays varied.",
      "A closing lesson about the outcome and what you would repeat on the next project, also around two lines long.",
    ],
  },
};
