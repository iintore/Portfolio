import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "../content";
import { Dots } from "./Preloader";
import { Chevron } from "./Icons";
import { BODY_FADE, NAV_SPRING } from "../lib/motion";
import { useIsDesktop } from "../lib/useIsDesktop";

// Reference behaviour: "Nav Default" (open, links visible) until the page is
// scrolled DOWN, then "Nav Closed" (avatar + name + dots). Scrolling up anywhere
// restores Default. Hovering the dots opens it ("Nav Open"); leaving the pill
// closes it again. Variant changes use a 0.6s spring with no bounce.
type Variant = "default" | "closed" | "open";

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
                    <a key={l.label} className="nav__link" href={l.href}>
                      {l.label}
                    </a>
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
