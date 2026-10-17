import { useState } from "react";
import { motion } from "framer-motion";
import { Arrow, Download, Lock, Store } from "./Icons";
import { BUTTON_SPRING } from "../lib/motion";

type Kind = "primary" | "soon" | "store" | "download";

// Hover state (measured on the reference): the 44px filler grows to the pill's
// width minus 10px; the first label rises 40px out of view while the second
// rises 25px into place; the arrow row slides 28px left. 0.7s spring, 0.15 bounce.
export function PillButton({ kind, label, href, asText = false }: { kind: Kind; label: string; href?: string; asText?: boolean }) {
  const [hover, setHover] = useState(false);
  const interactive = kind !== "soon";
  const cls = kind === "primary" ? "btn btn--light" : kind === "download" ? "btn btn--raised" : kind === "soon" ? "btn btn--ghost" : "btn btn--stone";
  const restText = kind === "soon" ? "#fff" : kind === "store" || kind === "download" ? "#000" : "rgb(9, 9, 9)";
  const Icon = kind === "soon" ? Lock : kind === "store" ? Store : kind === "download" ? Download : Arrow;
  // inside a card that is itself a link, render as plain text (no nested <a>)
  const Tag = (interactive && href && !asText ? motion.a : motion.span) as typeof motion.a;
  return (
    <Tag
      className={cls}
      href={interactive && !asText ? href : undefined}
      target={kind === "store" ? "_blank" : undefined}
      rel={kind === "store" ? "noreferrer" : undefined}
      onHoverStart={() => interactive && setHover(true)}
      onHoverEnd={() => setHover(false)}
    >
      <motion.span className="btn__filler" animate={{ width: hover ? "calc(100% - 10px)" : "44px" }} transition={BUTTON_SPRING} />
      <span className="btn__icon">
        <motion.span className="btn__arrows" animate={{ x: hover ? -28 : 0 }} transition={BUTTON_SPRING}>
          <Icon />
          <Icon />
        </motion.span>
      </span>
      <span className="btn__texts" style={kind === "download" ? { width: "auto" } : undefined}>
        <motion.p
          style={{ color: restText }}
          animate={{ y: hover ? -40 : 0, color: hover && kind === "primary" ? "#ffffff" : restText }}
          transition={BUTTON_SPRING}
        >
          {label}
        </motion.p>
        <motion.p style={{ color: "rgb(249, 249, 249)" }} animate={{ y: hover ? -25 : 0 }} transition={BUTTON_SPRING}>
          {label}
        </motion.p>
      </span>
    </Tag>
  );
}
