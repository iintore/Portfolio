import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { contact, site, testimonials } from "../content";
import { Behance, LinkedIn, Paperclip } from "./Icons";
import { SectionHead, Separator } from "./Section";
import { CYCLE_SPRING, EASE_SOCIAL, EASE_STD, SIDE_CLOUD_SPRING, SOCIAL_HOVER, TICKER_SPRING } from "../lib/motion";

// Side cloud: scroll transform triggered "in view" — x runs from ±40 to 0 while
// the cloud travels from entering the viewport to being fully inside it,
// smoothed by a spring (stiffness 150, damping 40, mass 1).
function SideCloud({ side, className, src }: { side: "left" | "right"; className: string; src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const raw = useTransform(scrollYProgress, [0, 1], [side === "left" ? -40 : 40, 0]);
  const x = useSpring(raw, SIDE_CLOUD_SPRING);
  return (
    <motion.div ref={ref} className={`side-cloud ${className}`} style={{ x }}>
      <img src={src} alt="" />
    </motion.div>
  );
}

export function SideClouds({ variant }: { variant: "section" | "contact" }) {
  return (
    <>
      <SideCloud side="left" className={`side-cloud--left side-cloud--${variant}`} src="/decor/cloud-left.webp" />
      <SideCloud side="right" className={`side-cloud--right side-cloud--${variant}`} src="/decor/cloud-right.webp" />
    </>
  );
}

type Item = (typeof testimonials.items)[number];

function QuoteCard({ item }: { item: Item }) {
  return (
    <li className={`quote${item.tall ? " quote--tall" : ""}`}>
      <div className="quote__sheet">
        <div className="quote__paper">
          <div />
          <div className="grain" />
        </div>
        <div className="quote__polaroid">
          <div className="quote__polaroid-inner">
            <img className="quote__photo" src={item.photo} alt="" />
            <div className="quote__who">
              <h3 className="quote__name">{item.name}</h3>
              <p className="quote__role">{item.role}</p>
            </div>
            <div className="grain" />
          </div>
        </div>
        <div className="quote__text">
          <p>{item.quote}</p>
        </div>
        <div className="clip clip--back">
          <Paperclip />
        </div>
        <div className="clip clip--front">
          <Paperclip />
        </div>
      </div>
    </li>
  );
}

// Ticker component configured at speed 80 (px/s), leftward.
const SPEED = 80;
function Ticker() {
  const list = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);
  const [setWidth, setSetWidth] = useState(0);
  useLayoutEffect(() => {
    const measure = () => {
      if (!list.current) return;
      const n = testimonials.items.length;
      const kids = list.current.children;
      if (kids.length > n) setSetWidth((kids[n] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (list.current) ro.observe(list.current);
    return () => ro.disconnect();
  }, []);
  useAnimationFrame((_, delta) => {
    if (!setWidth) return;
    let next = x.get() - (SPEED * delta) / 1000;
    if (next <= -setWidth) next += setWidth;
    x.set(next);
  });
  const items = [...testimonials.items, ...testimonials.items, ...testimonials.items];
  return (
    <div className="ticker">
      <motion.div
        className="ticker__window"
        initial={{ y: 200, scale: 1.05 }}
        whileInView={{ y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0 }}
        transition={TICKER_SPRING}
      >
        <motion.ul className="ticker__list" ref={list} style={{ x }}>
          {items.map((it, i) => (
            <QuoteCard key={i} item={it} />
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
}

// Text Cycle component: three variants, advancing every 1500ms. In each
// variant the current word sits in flow, the next one 68px below and the
// previous one 68px above (both blurred 5px, transparent). Variant changes use
// a 0.8s spring with no bounce; the container follows the current word's width.
function Cycle() {
  const words = contact.cycle;
  const [cur, setCur] = useState(0);
  const sizer = useRef<HTMLDivElement>(null);
  const [widths, setWidths] = useState<number[]>([]);
  useLayoutEffect(() => {
    const el = sizer.current;
    if (!el) return;
    const measure = () => setWidths(Array.from(el.children).map((c) => (c as HTMLElement).offsetWidth));
    measure();
    document.fonts?.ready.then(measure);
  }, [words]);
  useEffect(() => {
    const id = setInterval(() => setCur((c) => (c + 1) % words.length), 1500);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <motion.div className="cycle" animate={widths.length ? { width: widths[cur] } : undefined} transition={CYCLE_SPRING}>
      <div className="cycle__sizer" ref={sizer} aria-hidden="true">
        {words.map((w) => (
          <span key={w} className="cycle__word cycle__word--measure">
            {w}
          </span>
        ))}
      </div>
      {words.map((w, i) => {
        const rel = (i - cur + words.length) % words.length; // 0 current, 1 next, 2 previous
        const y = rel === 0 ? 0 : rel === 1 ? 68 : -68;
        return (
          <motion.p
            key={w}
            className="cycle__word"
            aria-hidden={rel !== 0}
            initial={false}
            animate={{ y, opacity: rel === 0 ? 1 : 0, filter: rel === 0 ? "blur(0px)" : "blur(5px)" }}
            transition={CYCLE_SPRING}
          >
            {w}
          </motion.p>
        );
      })}
    </motion.div>
  );
}

function SocialButton({ s, index }: { s: (typeof site.socials)[number]; index: number }) {
  // LinkedIn slides in from x:20 with no delay; Behance from x:10 after 0.1s.
  const from = index === 0 ? 20 : 10;
  return (
    <motion.a
      className="social"
      href={s.href}
      target="_blank"
      rel="noreferrer"
      aria-label={s.label}
      initial={{ opacity: 0, x: from }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: "tween", duration: 0.6, ease: EASE_SOCIAL, delay: index === 0 ? 0 : 0.1 }}
      whileHover={{ y: -5, transition: SOCIAL_HOVER }}
    >
      {s.icon === "linkedin" ? <LinkedIn /> : <Behance />}
    </motion.a>
  );
}

// The "lets … together" contact block with the giant wordmark; shared by every page.
export function Contact() {
  return (
    <div className="contact">
      <SideClouds variant="contact" />
      <div className="contact__top">
        <div className="contact__heading-row">
          <div className="contact__heading">
            <div className="contact__line1">
              <p className="contact__big">{contact.lead}</p>
              <Cycle />
            </div>
            <p className="contact__big">{contact.line2}</p>
          </div>
          <motion.div
            className="slideshow"
            initial={{ opacity: 0.001, rotate: -13, x: -9, y: -43 }}
            animate={{ opacity: 1, rotate: -2, x: 0, y: 0 }}
            transition={{ type: "tween", duration: 1, ease: EASE_STD }}
          >
            <div className="slideshow__media">
              {contact.video ? <video src={contact.video} autoPlay muted loop playsInline /> : <div className="slideshow__placeholder" />}
            </div>
          </motion.div>
        </div>
        <div className="contact__links">
          <div className="contact__item">
            <p className="contact__k">{contact.emailLabel}</p>
            <a className="contact__v" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
          <div className="contact__item contact__item--social">
            <p className="contact__k">{contact.socialLabel}</p>
            <div className="socials">
              {site.socials.map((s, i) => (
                <SocialButton key={s.label} s={s} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="legal">{site.copyright}</p>
      <div className="fit-text" aria-hidden="true">
        <svg viewBox="0 0 1336 279">
          <defs>
            <linearGradient id="fit-fill" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0.24" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.91" stopColor="#fff" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <text
            x="668"
            y="236"
            textAnchor="middle"
            textLength="1336"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#fit-fill)"
            style={{ fontFamily: "var(--wide)", fontWeight: 900, fontSize: 300 }}
          >
            {contact.bigWord}
          </text>
        </svg>
      </div>
    </div>
  );
}

export function Closing() {
  return (
    <section className="closing">
      <SideClouds variant="section" />
      <Separator full />
      <div className="closing__inner">
        <SectionHead label={testimonials.label} title={testimonials.title} body={testimonials.body} />
        <Ticker />
      </div>
      <Contact />
    </section>
  );
}
