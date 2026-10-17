import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { whatIDo } from "../content";
import { FadeIn, Label, Separator } from "./Section";
import { BODY_FADE } from "../lib/motion";

// Word reveal (reference component settings): progress = (viewportHeight -
// statementTop) / 800, clamped 0..1. Word i gets n = clamp(progress * words - i);
// its blur is 1px * (1 - n) and it takes the reveal colour only once n reaches 1.
// Colour and blur carry a 0.2s ease-out CSS transition.
const REVEAL_DISTANCE = 800;
const INITIAL_BLUR = 1;

function Statement() {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = whatIDo.statement;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (window.innerHeight - top) / REVEAL_DISTANCE));
      setProgress((prev) => (Math.abs(prev - p) < 5e-4 ? prev : p));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  const count = words.length;
  return (
    <div className="statement-wrap">
      <h2 className="statement" ref={ref}>
        {words.map((w, i) => {
          const text = typeof w === "string" ? w : w.text;
          const accent = typeof w !== "string";
          const n = Math.min(1, Math.max(0, progress * count - i));
          const revealed = n >= 1;
          return (
            <span key={i}>
              <span
                className={`word${accent ? " word--accent" : ""}`}
                style={{
                  color: revealed ? (accent ? "var(--blue)" : "rgb(30, 30, 30)") : "rgba(30, 30, 30, 0.25)",
                  filter: `blur(${INITIAL_BLUR * (1 - n)}px)`,
                }}
              >
                {text}
              </span>
              {i < count - 1 ? " " : ""}
            </span>
          );
        })}
      </h2>
    </div>
  );
}

// Number counter: springs from its start to its end value (COUNTER_SPRING: 2s, no bounce) the
// first time any part of it enters the viewport.
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: "some" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { type: "spring", duration: 2, bounce: 0, onUpdate: (v: number) => setN(v) });
    return () => c.stop();
  }, [inView, value]);
  return (
    <div className="stat__num-wrap">
      <p className="stat__num stat__num--ghost" aria-hidden="true">
        {value}
        {suffix}
      </p>
      <p className="stat__num" ref={ref}>
        {Math.round(n).toLocaleString("en-US")}
        {suffix}
      </p>
    </div>
  );
}

export function WhatIDo() {
  return (
    <section className="about-section">
      <div className="stats">
        <Separator />
        <div className="stats__top">
          <div className="stats__label-col">
            <Label text={whatIDo.label} />
          </div>
          <div className="stats__content">
            <Statement />
            <motion.div
              className="stats__row"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={BODY_FADE}
            >
              {whatIDo.stats.map((s) => (
                <div className="stat" key={s.title}>
                  <div className="stat__counter">
                    <Counter value={s.value} suffix={s.suffix} />
                    <div className="stat__sep" />
                  </div>
                  <div className="stat__texts">
                    <p className="stat__title">{s.title}</p>
                    <p className="stat__body">{s.body}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { FadeIn };
