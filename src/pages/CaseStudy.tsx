import { Fragment, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useAnimationFrame, useInView, useMotionValue, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { caseStudy as cs } from "../content";
import { Contact, SideClouds } from "../components/Closing";
import { Label, RevealTitle, Separator } from "../components/Section";
import { Paperclip } from "../components/Icons";
import {
  BODY_FADE,
  CHAR_STAGGER,
  CS_HERO_FADE,
  CS_HERO_RISE,
  DECISION_IN,
  NOTE_TAP,
  SOFT_SPRING,
  TICKER_RISE,
  WORD_REVEAL,
  spring,
} from "../lib/motion";

// Every effect below mirrors the reference case-study page module:
//  • body copy: opacity 0 → 1, 0.4s tween after 0.3s, once half visible
//  • headings: per-character blur reveal once fully visible (RevealTitle)
//  • "scroll target" transforms map scroll progress linearly, from the target's
//    top reaching the bottom of the viewport to its bottom reaching it

type Tag = "p" | "div";
function Fade({ as = "div", className, children }: { as?: Tag; className?: string; children: ReactNode }) {
  const M = motion[as];
  return (
    <M className={className} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={BODY_FADE}>
      {children}
    </M>
  );
}

// progress of `ref` from its top at the viewport bottom to its bottom at the viewport bottom
function useTargetProgress(ref: React.RefObject<HTMLElement>) {
  return useScroll({ target: ref, offset: ["start end", "end end"] }).scrollYProgress;
}

function Header({ label, title, body, align = "center" }: { label: string; title: string; body: string; align?: "center" | "left" }) {
  return (
    <div className={`cs-header cs-header--${align}`}>
      <Label text={label} />
      <div className="cs-header__text">
        <RevealTitle text={title} className="cs-h2" />
        <Fade as="p" className="cs-body">
          {body}
        </Fade>
      </div>
    </div>
  );
}

function Bento({ src, className = "" }: { src: string; className?: string }) {
  return (
    <div className={`bento ${className}`}>
      <div className="bento__inner">
        <img src={src} alt="" />
      </div>
    </div>
  );
}

// hero media: scale 1.2 → 1 while it scrolls into view (trigger "in view")
function ZoomBento({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scale = useTransform(useTargetProgress(ref), [0, 1], [1.2, 1]);
  return (
    <div className="bento bento--hero">
      <div className="bento__inner">
        <motion.div ref={ref} className="bento__zoom" style={{ scale }}>
          <img src={src} alt="" />
        </motion.div>
      </div>
    </div>
  );
}

// phone screens: the device fades in on a soft spring (stiffness 60, damping 30,
// 0.15s delay) as soon as any of it is visible; captions use the body fade
function PhoneCard({ img, caption, tag }: { img: string; caption?: string; tag?: string }) {
  return (
    <div className="ui-card">
      {tag ? (
        <Fade as="p" className="ui-card__tag">
          {tag}
        </Fade>
      ) : null}
      <div className="ui-card__frame">
        <motion.img src={img} alt="" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0 }} transition={SOFT_SPRING(0.15)} />
      </div>
      {caption ? (
        <Fade className="ui-card__caption">
          <p>{caption}</p>
        </Fade>
      ) : null}
    </div>
  );
}

// ── problems: cards slide out from behind the phone as the row scrolls in ──
type Problem = (typeof cs.problems)[number];
function ProblemCard({ item, progress, fromX, tilt }: { item: Problem; progress: MotionValue<number>; fromX: number; tilt: number }) {
  const x = useTransform(progress, [0, 1], [fromX, 0]);
  const rotate = useTransform(progress, [0, 1], [0, tilt]);
  const opacity = useTransform(progress, [0, 1], [0, 1]);
  return (
    <motion.div className="problem" style={{ x, rotate, opacity }}>
      <div className="problem__head">
        <span className="problem__dot" />
        <p className="problem__t">{item.t}</p>
      </div>
      <p className="problem__b">{item.b}</p>
    </motion.div>
  );
}

function Problems() {
  const row = useRef<HTMLDivElement>(null);
  const p = useTargetProgress(row);
  const scale = useTransform(p, [0, 1], [0.9, 1]);
  const y = useTransform(p, [0, 1], [72, 0]);
  const opacity = useTransform(p, [0, 1], [0.5, 1]);
  const [a, b, c, d] = cs.problems;
  return (
    <div className="problems" ref={row}>
      <div className="problems__col">
        <ProblemCard item={a} progress={p} fromX={120} tilt={-2} />
        <ProblemCard item={b} progress={p} fromX={120} tilt={2} />
      </div>
      <motion.div className="problem-phone" style={{ scale, y, opacity }}>
        <img src={cs.problemMedia} alt="" />
      </motion.div>
      <div className="problems__col problems__col--right">
        <ProblemCard item={c} progress={p} fromX={-120} tilt={2} />
        <ProblemCard item={d} progress={p} fromX={-120} tilt={-2} />
      </div>
    </div>
  );
}

// ── user quotes ticker: 40px/s to the left, half speed while hovered, 25% edge
// fades; rises from y 64 on a spring (stiffness 150, damping 30) when half visible
const TICKER_SPEED = 40;
const TICKER_HOVER_FACTOR = 0.5;
function VoiceTicker() {
  const x = useMotionValue(0);
  const list = useRef<HTMLUListElement>(null);
  const [hover, setHover] = useState(false);
  useAnimationFrame((_, dt) => {
    const el = list.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    let n = x.get() - (TICKER_SPEED * (hover ? TICKER_HOVER_FACTOR : 1) * dt) / 1000;
    if (n <= -half) n += half;
    x.set(n);
  });
  const quotes = [...cs.voices.quotes, ...cs.voices.quotes];
  return (
    <motion.div
      className="voice-ticker"
      initial={{ opacity: 0, y: 64 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={TICKER_RISE}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.ul ref={list} style={{ x }}>
        {quotes.map((q, i) => (
          <li className="voice" key={i}>
            <p className="voice__q">{q.q}</p>
            <div className="voice__who">
              <img src="/placeholders/avatar-a.webp" alt="" />
              <div>
                <p className="voice__n">{q.n}</p>
                <p className="voice__r">{q.r}</p>
              </div>
            </div>
          </li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

// ── sticky notes: rise from y 200 / scale 1.05 (spring 1s, bounce .2, staggered
// .2s) as soon as visible; free to drag (no momentum), scale 1.05 while pressed
const NOTE_COLORS = ["rgb(255, 248, 232)", "rgb(232, 245, 255)", "rgb(250, 204, 197)"];
const NOTE_TILT = [-2, 1.5, 2.5];
const NOTE_DELAY = [0, 0.2, 0.4];
// two paper creases per note: centre height (px) and tilt (deg), as on the reference
const NOTE_BENDS = [
  [[69, -11], [149, 5]],
  [[69, -5], [149, 4]],
  [[69, 14], [149, -7]],
];

function Notes() {
  return (
    <div className="notes">
      {cs.goals.notes.map((n, i) => (
        <motion.div
          key={i}
          className="note"
          initial={{ y: 200, scale: 1.05 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={spring(1, 0.2, NOTE_DELAY[i])}
          drag
          dragMomentum={false}
          whileTap={{ scale: 1.05, cursor: "grabbing", transition: NOTE_TAP }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="note__paper" style={{ background: NOTE_COLORS[i], rotate: `${NOTE_TILT[i]}deg` }}>
            <div className="note__lines">
              {Array.from({ length: 8 }).map((_, k) => (
                <span key={k} />
              ))}
            </div>
            <p className="note__text">{n}</p>
            {NOTE_BENDS[i].map(([top, tilt], k) => (
              <span key={k} className="note__bend" style={{ top, rotate: `${tilt}deg` }} aria-hidden="true" />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── decisions: once the row's top reaches the viewport bottom, each card fades
// in from scale 1.1 (0.4s tween, staggered .25s). Inside, the card body settles
// from opacity .8 and its number rises 10px when half visible.
const DECISION_TINT = ["rgb(255, 252, 245)", "rgb(245, 251, 255)", "rgb(255, 240, 237)", "rgb(255, 247, 242)"];
const DECISION_EDGE = ["rgb(247, 240, 220)", "rgb(213, 227, 237)", "rgb(250, 220, 215)", "rgb(250, 228, 214)"];

function Decisions() {
  const row = useRef<HTMLDivElement>(null);
  const shown = useInView(row, { once: true, amount: 0 });
  return (
    <div className="decisions" ref={row}>
      {cs.decisions.items.map((d, i) => (
        <motion.div
          className="decision-slot"
          key={d.t}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.1 }}
          transition={DECISION_IN(i * 0.25)}
        >
          <motion.div className="decision" initial={{ opacity: 0.8 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={spring(0.6, 0)}>
            <span className="decision__pin" aria-hidden="true" />
            <motion.p
              className="decision__n"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={spring(0.7, 0, 0.1)}
            >
              {String(i + 1).padStart(2, "0")}
            </motion.p>
            <div className="decision__content" style={{ background: DECISION_TINT[i], ["--edge" as string]: DECISION_EDGE[i] }}>
              <h3 className="decision__t">{d.t}</h3>
              <p className="decision__b">{d.b}</p>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

// ── reflections: per-word reveal (blur 10px, y 10), 0.4s spring, 50ms per word,
// across the title and every point, once half the text block is visible
function Reflections() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  let wi = 0;
  const words = (text: string) =>
    text.split(" ").map((w, k, arr) => {
      const i = wi++;
      return (
        <Fragment key={k}>
          <motion.span
            style={{ display: "inline-block" }}
            variants={WORD_REVEAL}
            initial="hidden"
            animate={inView ? "shown" : "hidden"}
            transition={spring(0.4, 0, i * CHAR_STAGGER)}
          >
            {w}
          </motion.span>
          {k < arr.length - 1 ? " " : null}
        </Fragment>
      );
    });
  return (
    <div className="reflections">
      <div className="reflections__sheet">
        <div className="quote__paper">
          <div />
          <div className="grain" />
        </div>
        <div className="reflections__text" ref={ref}>
          <h4 className="reflections__title">{words(cs.reflections.title)}</h4>
          <ul>
            {cs.reflections.points.map((p, i) => (
              <li key={i}>{words(p)}</li>
            ))}
          </ul>
        </div>
        <div className="clip clip--back">
          <Paperclip />
        </div>
        <div className="clip clip--front">
          <Paperclip />
        </div>
      </div>
    </div>
  );
}

const OUTCOME_TILT = [1, -1, 1];
const TITLE_START_MS = 700;

export function CaseStudy() {
  // On the reference, the on-mount title effect starts once the page has
  // hydrated, measured at 0.7s after the hero block starts rising
  const [titleReady, setTitleReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setTitleReady(true), TITLE_START_MS);
    return () => window.clearTimeout(t);
  }, []);

  // the reference page paints its whole background white
  useEffect(() => {
    document.documentElement.classList.add("route-cs");
    return () => document.documentElement.classList.remove("route-cs");
  }, []);

  return (
    <>
      <main className="cs">
        <div className="cs__top">
          {/* hero block rises from y 180 on load; tags, intro and meta fade in after 1s */}
          <motion.section
            className="cs-hero"
            initial={{ opacity: 0.001, y: 180 }}
            animate={{ opacity: 1, y: 0 }}
            transition={CS_HERO_RISE}
          >
            <div className="cs-hero__text">
              <motion.div className="cs-tags" initial={{ opacity: 0.001 }} animate={{ opacity: 1 }} transition={CS_HERO_FADE}>
                {cs.tags.map((t) => (
                  <span className="cs-tag" key={t}>
                    {t}
                  </span>
                ))}
              </motion.div>
              <RevealTitle text={cs.title} className="cs-title" trigger="mount" ready={titleReady} />
              <motion.p className="cs-intro" initial={{ opacity: 0.001 }} animate={{ opacity: 1 }} transition={CS_HERO_FADE}>
                {cs.intro}
              </motion.p>
            </div>
            <motion.div className="cs-meta" initial={{ opacity: 0.001 }} animate={{ opacity: 1 }} transition={CS_HERO_FADE}>
              {cs.meta.map((m) => (
                <div className="cs-meta__item" key={m.k}>
                  <p className="cs-meta__k">{m.k}</p>
                  {"live" in m && m.live ? (
                    <div className="live">
                      <span className="live__dot">
                        <motion.span
                          className="live__pulse"
                          animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                        />
                      </span>
                      <p className="cs-meta__v cs-meta__v--live">{m.v}</p>
                    </div>
                  ) : (
                    <p className="cs-meta__v">{m.v}</p>
                  )}
                </div>
              ))}
            </motion.div>
          </motion.section>

          <ZoomBento src={cs.heroMedia} />

          <div className="cs-context">
            <div className="cs-context__head">
              <Label text={cs.context.label} />
              <div className="cs-context__text">
                <RevealTitle text={cs.context.title} className="cs-h2" />
                <Fade className="cs-context__paras">
                  {cs.context.paragraphs.map((p, i) => (
                    <p key={i} className={i === 0 ? "is-strong" : undefined}>
                      {p}
                    </p>
                  ))}
                </Fade>
              </div>
            </div>
            <Fade className="cs-stats">
              {cs.context.stats.map((s) => (
                <div className="cs-stat" key={s.v}>
                  <p className="cs-stat__v">{s.v}</p>
                  <p className="cs-stat__k">{s.k}</p>
                </div>
              ))}
            </Fade>

            <Problems />

            <div className="cs-header cs-header--center cs-header--plain">
              <div className="cs-header__text">
                <RevealTitle text={cs.voices.title} className="cs-h2" />
                <Fade as="p" className="cs-body cs-body--wide">
                  {cs.voices.body}
                </Fade>
              </div>
            </div>
            <VoiceTicker />
            <Fade as="p" className="voices__note">
              {cs.voices.note}
            </Fade>
          </div>
        </div>

        <Separator />

        <div className="cs-block">
          <Header label={cs.goals.label} title={cs.goals.title} body={cs.goals.body} />
          <div className="goals">
            <Notes />
            <Fade className="goal-cards">
              {cs.goals.cards.map((g) => (
                <div className="goal" key={g.t}>
                  <svg className="goal__icon" viewBox="0 0 30 30" aria-hidden="true">
                    <circle cx="15" cy="15" r="13" fill="none" stroke="rgb(25,156,27)" strokeWidth="2" />
                    <path d="M9.5 15.5 13.5 19.5 21 11" fill="none" stroke="rgb(25,156,27)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="goal__text">
                    <p className="goal__t">{g.t}</p>
                    <p className="goal__b">{g.b}</p>
                  </div>
                </div>
              ))}
            </Fade>
          </div>
        </div>

        <div className="cs-block cs-block--decisions">
          <Header label={cs.decisions.label} title={cs.decisions.title} body={cs.decisions.body} />
          <Decisions />
        </div>

        <Separator />

        <div className="cs-block">
          <Header label={cs.journey.label} title={cs.journey.title} body={cs.journey.body} />
          <div className="ui-grid">
            {cs.journey.screens.map((s, i) => (
              <PhoneCard key={i} img={s.img} caption={s.caption} />
            ))}
          </div>
        </div>

        <div className="features">
          {cs.features.map((f, i) => (
            <div className={`feature${i % 2 ? " feature--flip" : ""}`} key={f.label}>
              <div className="feature__text">
                <Label text={f.label} />
                <div className="feature__copy">
                  <RevealTitle text={f.title} className="cs-h2" />
                  <Fade as="p" className="cs-body">
                    {f.body}
                  </Fade>
                </div>
                {"note" in f && f.note ? (
                  <Fade as="p" className="feature__note">
                    <strong>{f.note[0]}</strong>
                    {f.note[1]}
                  </Fade>
                ) : null}
              </div>
              <Bento src={f.media} className="bento--square" />
            </div>
          ))}
        </div>

        <Separator />

        <div className="cs-block">
          <Header label={cs.after.label} title={cs.after.title} body={cs.after.body} />
          <div className="after">
            <Bento src={cs.after.media} className="bento--after" />
            <div className="ui-grid">
              {cs.after.screens.map((s, i) => (
                <PhoneCard key={i} img={s} />
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div className="cs-block">
          <Header label={cs.beforeAfter.label} title={cs.beforeAfter.title} body={cs.beforeAfter.body} />
          <div className="before-after">
            {cs.beforeAfter.items.map((b) => (
              <PhoneCard key={b.tag} img={b.img} caption={b.caption} tag={b.tag} />
            ))}
          </div>
        </div>
      </main>

      <section className="closing closing--cs">
        <SideClouds variant="section" />
        <Separator full />
        <div className="cs-outcome">
          <div className="section-head">
            <Label text={cs.outcome.label} />
            <div className="section-head__text">
              <RevealTitle text={cs.outcome.title} />
              <Fade as="p" className="section-body cs-outcome__body">
                {cs.outcome.body}
              </Fade>
            </div>
          </div>
          <div className="outcome-cards">
            {cs.outcome.stats.map((s, i) => (
              <motion.div
                key={s.t}
                style={{ rotate: OUTCOME_TILT[i] }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0 }}
                transition={SOFT_SPRING(i * 0.15)}
              >
                <div className="outcome">
                  <div className="outcome__visual">
                    <svg viewBox="0 0 71 71" aria-hidden="true">
                      <path
                        d={s.dir === "down" ? "M35.5 8v52M14 39l21.5 21.5L57 39" : "M35.5 63V11M14 32l21.5-21.5L57 32"}
                        fill="none"
                        stroke="rgb(25,156,27)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="outcome__v">{s.v}</p>
                  </div>
                  <div className="outcome__text">
                    <p className="outcome__t">{s.t}</p>
                    <p className="outcome__b">{s.b}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <Reflections />
        <Contact />
      </section>
    </>
  );
}
