import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { site } from "../content";
import { CHAR_STAGGER, EASE_LOADER, FRAMER_DEFAULT } from "../lib/motion";

// Loader sequence (from the reference component):
//  • on mount: letters drop from y:-20 (spring stiffness 200 / damping 20 / mass 1, 50ms apart)
//  • dots cycle Dot 1 → Dot 2 → Dot 3 → Default every 400ms (Framer default spring)
//  • 4000ms after mount the loader switches to "Load Finish": the name row spreads
//    (gap → 240px) and fades, and four panels collapse to 2% height at top:-40px
//    using 1s tweens (ease .79,.04,.16,1.03) delayed 0 / .05 / .08 / .12s
//  • shown once per browser session
export const FINISH_AFTER_MS = 4000;
const PANEL_DELAYS = [0, 0.05, 0.08, 0.12];
const PANEL_WIDTHS = ["102%", "102%", "104%", "104%"];
const PANEL_LEFTS = ["-1.80723%", "-1.80723%", "-2.40964%", "-2.40964%"];

// 0 = none raised, 1..3 = that dot raised 3px and solid blue
export function Dots({ color = "rgba(2, 129, 224, 0.5)", active = "rgb(2, 129, 224)", cycle = true }: { color?: string; active?: string; cycle?: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!cycle) return;
    const id = setInterval(() => setStep((s) => (s + 1) % 4), 400);
    return () => clearInterval(id);
  }, [cycle]);
  const raised = cycle ? [1, 2, 3, 0][step] : 0;
  return (
    <div className="dots" aria-hidden="true">
      {[1, 2, 3].map((d) => (
        <motion.span
          key={d}
          animate={{ y: raised === d ? -3 : 0, backgroundColor: raised === d ? active : color }}
          transition={FRAMER_DEFAULT}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

function DropWord({ text }: { text: string }) {
  return (
    <p className="loader__word">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="split-char"
          initial={{ opacity: 0.001, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, mass: 1, delay: i * CHAR_STAGGER }}
        >
          {ch}
        </motion.span>
      ))}
    </p>
  );
}

export function shouldShowPreloader() {
  try {
    return sessionStorage.getItem("preloaderShown") !== "true";
  } catch {
    return true;
  }
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const [finish, setFinish] = useState(false);
  useEffect(() => {
    try {
      sessionStorage.setItem("preloaderShown", "true");
    } catch {
      /* private mode: show every time */
    }
    const id = setTimeout(() => setFinish(true), FINISH_AFTER_MS);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="loader" aria-hidden="true">
      <div className="loader__panels">
        {PANEL_DELAYS.map((delay, i) => (
          <div className="loader__panel-wrap" key={i}>
            <motion.div
              className="loader__panel"
              style={{ width: PANEL_WIDTHS[i], left: PANEL_LEFTS[i] }}
              initial={{ top: "0px", height: "100%" }}
              animate={finish ? { top: "-40px", height: "2%" } : undefined}
              transition={{ type: "tween", duration: 1, ease: EASE_LOADER, delay }}
              onAnimationComplete={finish && i === 3 ? onDone : undefined}
            />
          </div>
        ))}
      </div>
      <div className="loader__intro">
        <motion.div
          className="loader__name"
          initial={{ gap: 8, opacity: 1 }}
          animate={finish ? { gap: 240, opacity: 0 } : undefined}
          transition={{ type: "tween", duration: 1, ease: EASE_LOADER }}
        >
          <DropWord text={site.firstName} />
          <Dots />
          <DropWord text={site.lastName} />
        </motion.div>
      </div>
    </div>
  );
}
