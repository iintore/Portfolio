import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { motion, useMotionValue } from "framer-motion";

// Custom hover cursors (reference: Framer "cursor" components on the project
// content cards and the journey cards). Inside a zone the system cursor is
// hidden and the custom cursor sits centred on the pointer with no trailing;
// it disappears the moment the pointer leaves.
//  • glass: 78px frosted circle with an icon, pops in from scale .5 / opacity 0
//  • stack: three tilted thumbnails (376 × 160), shown instantly
export type HoverCursorKind = { kind: "glass"; icon: "arrow" | "lock" } | { kind: "stack"; images: string[] };

const SetCursor = createContext<(c: HoverCursorKind | null) => void>(() => {});

// spring fitted to the reference cursor's entry (≈ 1.4% overshoot, ~250ms)
const GLASS_IN = { type: "spring", stiffness: 258, damping: 25.8, mass: 1 } as const;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8.5 15.5 15.5 8.5M10 8.5h5.5V14" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6.75" y="11" width="10.5" height="7.5" rx="1.8" />
      <path d="M9 11V9a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

// thumbnail placement inside the 376 × 160 stack (left, top, tilt)
const STACK = [
  { left: 224, top: 0, rotate: 8 },
  { left: 0, top: 0, rotate: -8 },
  { left: 116, top: 8, rotate: 8 },
];

export function HoverCursorProvider({ children }: { children: ReactNode }) {
  const [cursor, setCursor] = useState<HoverCursorKind | null>(null);
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <SetCursor.Provider value={setCursor}>
      {children}
      {cursor ? (
        <motion.div className="hover-cursor" style={{ x, y }} aria-hidden="true">
          {cursor.kind === "glass" ? (
            <motion.div className="hover-cursor__glass" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={GLASS_IN}>
              <div className="hover-cursor__rim" />
              <div className="hover-cursor__fill" />
              {cursor.icon === "arrow" ? <ArrowIcon /> : <LockIcon />}
            </motion.div>
          ) : (
            <div className="hover-cursor__stack">
              {STACK.map((s, i) => (
                <div key={i} className="hover-cursor__thumb" style={{ left: s.left, top: s.top, rotate: `${s.rotate}deg` }}>
                  <img src={cursor.images[i % cursor.images.length]} alt="" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ) : null}
    </SetCursor.Provider>
  );
}

// props for an element that shows `cursor` while a mouse is over it
export function useHoverCursor(cursor: HoverCursorKind) {
  const set = useContext(SetCursor);
  const key = JSON.stringify(cursor);
  const onPointerEnter = useCallback(
    (e: ReactPointerEvent) => {
      if (e.pointerType === "mouse") set(JSON.parse(key));
    },
    [set, key],
  );
  const onPointerLeave = useCallback(() => set(null), [set]);
  useEffect(() => () => set(null), [set]);
  return { onPointerEnter, onPointerLeave, "data-hover-cursor": "" };
}
