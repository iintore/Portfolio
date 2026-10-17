import type { Transition } from "framer-motion";

// Every value below is the literal configuration the reference site ships in
// its published page and component modules (not an estimate or curve fit).

export const EASE_STD = [0.44, 0, 0.56, 1] as const; // Framer "ease in-out"
export const EASE_LOADER = [0.79, 0.04, 0.16, 1.03] as const;
export const EASE_SOCIAL = [0.4, 0, 0.2, 1] as const;

// Framer's default variant transition
export const FRAMER_DEFAULT: Transition = { type: "spring", stiffness: 500, damping: 60, mass: 1 };

export const spring = (duration: number, bounce: number, delay = 0): Transition => ({ type: "spring", duration, bounce, delay });

// appear / scroll-appear presets
export const APPEAR_SPRING = spring(0.4, 0.2); // project image, glass card, experience card
export const TICKER_SPRING = spring(1, 0.2); // testimonial strip
export const BODY_FADE: Transition = { type: "tween", duration: 0.4, delay: 0.3, ease: EASE_STD }; // section body copy
export const NAV_SPRING = spring(0.6, 0); // nav variant changes
export const BUTTON_SPRING = spring(0.7, 0.15); // pill button hover
export const SOCIAL_HOVER = spring(0.6, 0.2);
export const CYCLE_SPRING = spring(0.8, 0);
export const COUNTER_SPRING = spring(2, 0);
export const SIDE_CLOUD_SPRING = { stiffness: 150, damping: 40, mass: 1 };
export const TRACK_SPRING = { stiffness: 120, damping: 30, mass: 0.4 };

// case-study page (checkout module)
export const CS_HERO_RISE: Transition = { type: "spring", stiffness: 139, damping: 30, mass: 1, delay: 0.1 }; // hero block, from y 180
export const CS_HERO_FADE: Transition = { type: "tween", duration: 1, delay: 1, ease: EASE_STD }; // tags, intro, meta row
export const SOFT_SPRING = (delay = 0): Transition => ({ type: "spring", stiffness: 60, damping: 30, mass: 1, delay }); // phones, outcome cards
export const TICKER_RISE: Transition = { type: "spring", stiffness: 150, damping: 30, mass: 1 }; // quotes ticker, from y 64
export const NOTE_TAP: Transition = spring(0.45, 0.25); // sticky note while pressed
export const DECISION_IN = (delay: number): Transition => ({ type: "tween", duration: 0.4, ease: EASE_STD, delay }); // from scale 1.1

// per-character appear effects
export const HERO_LETTER = { hidden: { opacity: 0.001, y: 10, filter: "blur(10px)" }, shown: { opacity: 1, y: 0, filter: "blur(0px)" } };
export const TITLE_LETTER = { hidden: { opacity: 0.001, y: 10, filter: "blur(4px)" }, shown: { opacity: 1, y: 0, filter: "blur(0px)" } };
export const WORD_REVEAL = { hidden: { opacity: 0.001, y: 10, filter: "blur(10px)" }, shown: { opacity: 1, y: 0, filter: "blur(0px)" } };
export const CHAR_STAGGER = 0.05;

// loops (repeatType mirror)
export const CLOUD_LOOP: Transition = { type: "tween", duration: 12, ease: EASE_STD, repeat: Infinity, repeatType: "mirror" };
export const FLOAT_LOOP: Transition = { type: "tween", duration: 2, ease: EASE_STD, repeat: Infinity, repeatType: "mirror" };

// shared "fixed px vs %" helpers live in CSS; breakpoint is 1200px
export const DESKTOP_QUERY = "(min-width: 1200px)";
