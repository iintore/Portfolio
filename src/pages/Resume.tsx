import { useRef } from "react";
import { motion } from "framer-motion";
import { resume } from "../content";
import { PillButton } from "../components/Button";
import { Contact, SideClouds } from "../components/Closing";
import { FadeIn, Label, RevealTitle, Separator } from "../components/Section";

// Sheet appear (reference values): from opacity .001, rotate -8, rotateY 24,
// scale 1.3, y 240 to rest at rotate -2, 1s tween ease-in-out, on mount.
export function Resume() {
  const section = useRef<HTMLElement>(null);
  return (
    <section className="closing resume" ref={section}>
      <SideClouds variant="section" />
      <Separator full />
      <div className="closing__inner">
        <div className="resume__head">
          <div className="section-head">
            <Label text={resume.label} />
            <div className="section-head__text">
              <RevealTitle text={resume.title} />
              <FadeIn className="section-body">
                {resume.body.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </FadeIn>
            </div>
          </div>
          <PillButton kind="download" label={resume.download.label} href={resume.download.href} />
        </div>
        <div className="resume__stage">
          <motion.div
            className="resume__sheet"
            initial={{ opacity: 0.001, rotate: -8, rotateY: 24, scale: 1.3, y: 240 }}
            animate={{ opacity: 1, rotate: -2, rotateY: 0, scale: 1, y: 0 }}
            transition={{ type: "tween", duration: 1, ease: [0.44, 0, 0.56, 1] }}
          >
            <img src={resume.sheet} alt="" />
          </motion.div>
        </div>
      </div>
      <Contact />
    </section>
  );
}
