import { motion } from "framer-motion";
import { Sparkle } from "./Icons";
import { BODY_FADE, CHAR_STAGGER, TITLE_LETTER, spring } from "../lib/motion";

export function Separator({ full = false }: { full?: boolean }) {
  return (
    <div className={`separator${full ? " separator--full" : ""}`}>
      <div className="separator__line" />
      <div className="separator__plus" />
    </div>
  );
}

export function Label({ text }: { text: string }) {
  return (
    <div className="label">
      <Sparkle />
      <p>{text}</p>
    </div>
  );
}

// Section titles: per-character appear (blur 4px, y 10, opacity .001), 0.4s
// spring with no bounce, 50ms per character, once the whole title is in view
// ("mount" plays it as soon as the page renders, like the case-study title).
// "\n" in the text is a hard line break; the character count runs across lines.
export function RevealTitle({
  text,
  className = "section-title",
  as = "h4",
  trigger = "inView",
  ready = true,
}: {
  text: string;
  className?: string;
  as?: "h2" | "h3" | "h4";
  trigger?: "inView" | "mount";
  // "mount" only: hold the reveal until the page's load animations have settled
  ready?: boolean;
}) {
  const Tag = motion[as];
  const play = trigger === "mount" ? { animate: ready ? "shown" : "hidden" } : { whileInView: "shown", viewport: { once: true, amount: 1 } };
  let index = 0;
  return (
    <Tag className={className} aria-label={text.replace(/\n/g, " ")} initial="hidden" {...play}>
      {text.split("\n").map((line, l, lines) => (
        <span key={l}>
          {line.split(" ").map((word, w, words) => (
            <span key={w} style={{ display: "inline-block", whiteSpace: word.length <= 12 ? "nowrap" : "normal" }}>
              {word.split("").map((ch) => {
                const i = index++;
                return (
                  <motion.span key={i} className="split-char" variants={TITLE_LETTER} transition={spring(0.4, 0, i * CHAR_STAGGER)}>
                    {ch}
                  </motion.span>
                );
              })}
              {w < words.length - 1 ? <span className="split-char"> </span> : null}
            </span>
          ))}
          {l < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </Tag>
  );
}

// Body copy blocks: opacity 0 → 1, 0.4s tween after 0.3s, once half visible.
export function FadeIn({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={BODY_FADE}>
      {children}
    </motion.div>
  );
}

export function SectionHead({ label, title, body, id }: { label: string; title: string; body: string; id?: string }) {
  return (
    <div className="section-head" id={id}>
      <Label text={label} />
      <div className="section-head__text">
        <RevealTitle text={title} />
        <FadeIn className="section-body">
          <p>{body}</p>
        </FadeIn>
      </div>
    </div>
  );
}
