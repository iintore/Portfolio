import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { work } from "../content";
import { PillButton } from "./Button";
import { SectionHead, Separator } from "./Section";
import { cloudDriftA, cloudDriftB } from "./Hero";
import { APPEAR_SPRING, CARD_STACK_SPRING } from "../lib/motion";
import { useHoverCursor } from "./HoverCursor";

// Stack: every card rises 100px and shrinks to 0.7 / 0.8 / 0.9 across the whole
// stack's scroll range, so earlier cards recede behind later ones; both values
// are smoothed by a spring (stiffness 400, damping 80), like the reference.
const END_SCALE = [0.7, 0.8, 0.9];
const STICKY_TOP = [0, 50, 100];

const BLUR_LAYERS = [0.0625, 0.125, 0.25, 0.5, 1, 2, 4, 8].map((b, i) => {
  const s = i * 12.5;
  const stops =
    i === 0
      ? `rgba(0,0,0,0) 0%, #000 12.5%, #000 25%, rgba(0,0,0,0) 37.5%`
      : i < 6
        ? `rgba(0,0,0,0) ${s}%, #000 ${s + 12.5}%, #000 ${s + 25}%, rgba(0,0,0,0) ${s + 37.5}%`
        : i === 6
          ? `rgba(0,0,0,0) 75%, #000 87.5%, #000 100%`
          : `rgba(0,0,0,0) 87.5%, #000 100%`;
  return { blur: b, mask: `linear-gradient(${stops})`, z: i + 1 };
});

export function ProgressiveBlur() {
  return (
    <div className="progressive-blur">
      {BLUR_LAYERS.map((l) => (
        <div
          key={l.z}
          style={{
            backdropFilter: `blur(${l.blur}px)`,
            WebkitBackdropFilter: `blur(${l.blur}px)`,
            maskImage: l.mask,
            WebkitMaskImage: l.mask,
            zIndex: l.z,
          }}
        />
      ))}
    </div>
  );
}

// scroll-appear helper: enter state → resting state once 50% is in view
const appear = (initial: Record<string, number>) => ({
  initial,
  whileInView: Object.fromEntries(Object.keys(initial).map((k) => [k, k === "opacity" ? 1 : 0])),
  viewport: { once: true, amount: 0.5 },
  transition: APPEAR_SPRING,
});

function Card({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const p = work.projects[index];
  const scale = useSpring(useTransform(progress, [0, 1], [1, END_SCALE[index]]), CARD_STACK_SPRING);
  const y = useSpring(useTransform(progress, [0, 1], [0, -100]), CARD_STACK_SPRING);
  // custom cursor over the content card: arrow for the live case study, lock otherwise
  const cursor = useHoverCursor({ kind: "glass", icon: p.cta.kind === "primary" ? "arrow" : "lock" });
  const glassBody = (
    <>
      <div className="glass__header">
        <div className="glass__num">{p.number}</div>
        <p className="glass__year">{p.year}</p>
      </div>
      <div className="glass__body">
        <h3 className="glass__title">{p.title}</h3>
        <div className="glass__tags">
          {p.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <p className="glass__desc">{p.body}</p>
      </div>
      <div className="glass__actions">
        <PillButton kind={p.cta.kind} label={p.cta.label} href={p.cta.href} asText={p.cta.kind === "primary"} />
        {"secondary" in p && p.secondary ? <PillButton kind="store" label={p.secondary.label} href={p.secondary.href} /> : null}
      </div>
    </>
  );
  const glassMotion = appear({ opacity: 0, rotateX: 100, y: 32 });
  return (
    <motion.div className={`card card--${index + 1}`} style={{ top: STICKY_TOP[index], scale, y }}>
      <img className="card__sky" src="/decor/sky-card.webp" alt="" />
      <motion.div className="card__image" {...appear({ y: 72 })}>
        <img src={p.image} alt="" />
      </motion.div>
      <div className="card__cloud-a-wrap">
        <motion.div className="cloud cloud--fade-right" {...cloudDriftA}>
          <img src="/decor/cloud-a.png" alt="" />
        </motion.div>
      </div>
      <motion.div className="cloud cloud--band card__cloud-b" {...cloudDriftB}>
        <img src="/decor/cloud-b.png" alt="" />
      </motion.div>
      <ProgressiveBlur />
      <div className="card__content">
        {p.cta.kind === "primary" ? (
          <motion.a className="glass" href={p.cta.href} {...glassMotion} {...cursor}>
            {glassBody}
          </motion.a>
        ) : (
          <motion.div className="glass" {...glassMotion} {...cursor}>
            {glassBody}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function WorkCards() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  return (
    <>
      <section className="work-head" id="work">
        <Separator />
        <SectionHead label={work.label} title={work.title} body={work.body} />
      </section>
      <section className="cards-section">
        <div className="cards" ref={ref}>
          {work.projects.map((_, i) => (
            <Card key={i} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </section>
    </>
  );
}
