import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { site } from "../content";
import { Dots } from "./Preloader";
import { Chevron } from "./Icons";
import { BODY_FADE, EASE_STD, NAV_SPRING } from "../lib/motion";
import { useIsDesktop } from "../lib/useIsDesktop";

// Reference behaviour: "Nav Default" (open, links visible) until the page is
// scrolled DOWN, then "Nav Closed" (avatar + name + dots). Scrolling up anywhere
// restores Default. Hovering the dots opens it ("Nav Open"); leaving the pill
// closes it again. Variant changes use a 0.6s spring with no bounce.
type Variant = "default" | "closed" | "open";

// Hand-drawn hover underlines (our own strokes, one per link). Like the
// reference they draw in left → right over 0.6s on hover and slide off to the
// right on leave; 2px blue, drawn in an 8px band right under the label.
const UNDERLINES: Record<string, { w: number; d: string }> = {
  Work: { w: 38, d: "M1.5 5.2 C 9 6.6, 21 6.4, 31 4.9 C 34 4.4, 36 3.4, 36.8 2.2" },
  About: { w: 44, d: "M1 5.4 C 4.5 2.6, 8 6.8, 12.5 4.6 S 20.5 2.4, 25 5 S 34 6.9, 43 3.2" },
  Resume: { w: 59, d: "M1 5.8 C 15 6.9, 31 6.3, 45 4.6 C 50.5 3.9, 54 2.5, 52.2 1.4 C 49.8 0.4, 47.6 4.8, 51.4 6.2 C 54.2 7.1, 56.8 5.6, 58 4.4" },
};
const DRAW = { duration: 0.6, ease: EASE_STD } as const;

function NavLink({ label, href }: { label: string; href: string }) {
  const [scope, animate] = useAnimate();
  const [shown, setShown] = useState(false);
  const run = useRef(0); // ignores a finished slide-off if the pointer came back
  const u = UNDERLINES[label] ?? UNDERLINES.About;
  const path = () => scope.current?.querySelector("path") as SVGPathElement | null;
  const enter = () => {
    const p = path();
    if (!p) return;
    run.current++;
    setShown(true);
    animate(p, { pathOffset: 0 }, { duration: 0 });
    animate(p, { pathLength: [0, 1] }, DRAW);
  };
  const leave = () => {
    const p = path();
    if (!p) return;
    const token = ++run.current;
    animate(p, { pathOffset: [0, 1] }, DRAW).then(() => {
      if (run.current === token) setShown(false);
    });
  };
  return (
    <a ref={scope} className="nav__link" href={href} onMouseEnter={enter} onMouseLeave={leave}>
      {label}
      <svg className="nav__underline" viewBox={`0 0 ${u.w} 8`} style={{ width: u.w, visibility: shown ? "visible" : "hidden" }} aria-hidden="true">
        <motion.path d={u.d} initial={{ pathLength: 0, pathOffset: 0 }} />
      </svg>
    </a>
  );
}

// Direction detection follows Framer's scroll-direction effect: the direction is
// re-evaluated once the page has moved 4px since the last change of direction,
// and positions outside the scrollable range (overscroll) are ignored.
const DIRECTION_SLOP = 4;

export function Nav({ back = false, openAtTop = !back, wideFrom = 1200 }: { back?: boolean; openAtTop?: boolean; wideFrom?: number }) {
  const desktop = useIsDesktop(wideFrom);
  const [variant, setVariant] = useState<Variant>(openAtTop ? "default" : "closed");

  useEffect(() => {
    let last = window.scrollY;
    let dir: "up" | "down" | null = null;
    let anchor = last;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (y < 0 || y > max) return;
      const now = y < last ? "up" : "down";
      last = y;
      if (now !== dir) {
        dir = now;
        anchor = y;
        return;
      }
      if (Math.abs(y - anchor) < DIRECTION_SLOP) return;
      if (now === "down") setVariant("closed");
      else if (openAtTop) setVariant("default");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [openAtTop]);

  const open = desktop ? variant !== "closed" : variant === "open";

  return (
    <>
      {back && (
        <motion.a className="back-pill" href="/" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={BODY_FADE}>
          <Chevron />
          <span>Back</span>
        </motion.a>
      )}
      <div className="nav-wrap">
        <motion.nav
          className="nav"
          layout
          transition={NAV_SPRING}
          onMouseLeave={() => variant === "open" && setVariant("closed")}
          style={{ borderRadius: 32, gap: open ? 64 : 32 }}
        >
          <motion.a layout="position" href="/" className="nav__brand" transition={NAV_SPRING}>
            <img className="nav__avatar" src={site.avatar} alt="" />
            <span className="nav__name">{site.firstName}</span>
          </motion.a>
          <motion.div layout="position" className="nav__right" transition={NAV_SPRING}>
            <AnimatePresence initial={false} mode="popLayout">
              {open ? (
                <motion.div
                  key="links"
                  className="nav__links"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={NAV_SPRING}
                >
                  {site.nav.map((l) => (
                    <NavLink key={l.label} label={l.label} href={l.href} />
                  ))}
                </motion.div>
              ) : (
                <motion.button
                  key="dots"
                  type="button"
                  className="nav__dots-btn"
                  aria-label="Open menu"
                  onMouseEnter={() => desktop && setVariant("open")}
                  onClick={() => setVariant("open")}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={NAV_SPRING}
                >
                  <Dots color="rgb(20, 20, 20)" active="rgb(20, 20, 20)" cycle={false} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.nav>
      </div>
    </>
  );
}
