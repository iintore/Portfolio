import { motion } from "framer-motion";
import { hero, site } from "../content";
import { Pin } from "./Icons";
import { CHAR_STAGGER, CLOUD_LOOP, FLOAT_LOOP, HERO_LETTER, spring } from "../lib/motion";
import { Media } from "./Media";

// Cloud loops: small clouds drift to (110, -27), the large band to (-48, -47),
// 12s tween with ease-in-out, mirrored forever.
export const cloudDriftA = { animate: { x: [0, 110], y: [0, -27] }, transition: CLOUD_LOOP };
export const cloudDriftB = { animate: { x: [0, -48], y: [0, -47] }, transition: CLOUD_LOOP };

// On the reference, on-mount text effects start once the page has hydrated:
// measured 1.07s after first paint (the hero figure's 1s-delayed rise starts at
// about the same moment). Both title words keep their own delays on top of it.
const TEXT_START = 1.07;

function Letters({ text, delay, duration }: { text: string; delay: number; duration: number }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="split-char"
          variants={HERO_LETTER}
          initial="hidden"
          animate="shown"
          transition={spring(duration, 0, delay + i * CHAR_STAGGER)}
        >
          {ch}
        </motion.span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <header className="hero">
      <div className="hero__stage">
        <img className="hero__sky" src="/decor/sky-hero.webp" alt="" />
        <motion.div
          className="hero__figure"
          initial={{ opacity: 0.001, y: 120 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring(1.5, 0.2, 1)}
        >
          {/* the LCP image: responsive AVIF/WebP, fetched with high priority */}
          <Media name={hero.figure} sizes="(min-width: 1200px) min(72vw, 1094px), 197vw" alt="Tony Lewis" priority />
        </motion.div>
        <motion.div className="cloud cloud--fade-right cloud--1" {...cloudDriftA}>
          <img src="/decor/cloud-a.webp" alt="" />
        </motion.div>
        <motion.div className="cloud cloud--fade-right cloud--2" {...cloudDriftA}>
          <img src="/decor/cloud-a.webp" alt="" />
        </motion.div>
        <motion.div className="cloud cloud--fade-right cloud--3" {...cloudDriftA}>
          <img src="/decor/cloud-a.webp" alt="" />
        </motion.div>
        <motion.div className="cloud cloud--band cloud--4" {...cloudDriftB}>
          <img src="/decor/cloud-b.webp" alt="" />
        </motion.div>

        <div className="hero__content">
          <div className="hero__block">
            <p className="hero__intro">
              {hero.greeting}
              <strong>{hero.greetingName}</strong>
            </p>
            <div className="hero__title">
              <h1 className="hero__line1" aria-label={hero.line1}>
                <Letters text={hero.line1} delay={TEXT_START} duration={1} />
              </h1>
              <motion.div className="hero__line2-wrap" animate={{ y: [0, -16] }} transition={FLOAT_LOOP}>
                <h1 className="hero__line2" aria-label={hero.line2}>
                  <Letters text={hero.line2} delay={TEXT_START + 1.5} duration={0.4} />
                </h1>
              </motion.div>
            </div>
            <div className="hero__currently">
              <p>{hero.currently}</p>
              <div className="company-pill">
                <img src={hero.company.logo} alt="" />
                <p>{hero.company.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero__banner">
        <div className="banner__inner">
          <div className="banner__group">
            <p className="banner__text">BASED IN</p>
            <div className="banner__loc">
              <Pin />
              <p className="banner__text banner__text--dark">{site.location}</p>
            </div>
          </div>
          <p className="banner__text banner__tagline">{site.tagline}</p>
        </div>
      </div>
    </header>
  );
}
