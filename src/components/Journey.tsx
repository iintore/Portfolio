import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { journey } from "../content";
import { Pin } from "./Icons";
import { Separator, SectionHead } from "./Section";
import { APPEAR_SPRING, TRACK_SPRING } from "../lib/motion";

type Role = (typeof journey.roles)[number];

// resting tilt of each card, left → right, and which ones rise in on scroll
const TILT = [2, -2, 1, -1];
const RISES = [true, true, false, false];

function Marker({ role }: { role: Role }) {
  const pill = (
    <div className="role__pill">
      {role.dates.length > 1 ? (
        <>
          <span>{role.dates[0]}</span>
          <em>{role.dates[1]}</em>
        </>
      ) : (
        <span>{role.dates[0]}</span>
      )}
    </div>
  );
  return (
    <div className="role__marker">
      {role.pill === "top" ? (
        <>
          {pill}
          <div className="role__dot" />
        </>
      ) : (
        <>
          <div className="role__dot" />
          {pill}
        </>
      )}
    </div>
  );
}

function RoleCard({ role, index }: { role: Role; index: number }) {
  const rotate = TILT[index % TILT.length];
  const rises = RISES[index] ?? false;
  return (
    <motion.div
      className="role__card"
      style={{ rotate }}
      initial={rises ? { opacity: 0, y: 120 } : false}
      whileInView={rises ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.5 }}
      transition={APPEAR_SPRING}
    >
      <div className="role__head">
        <img className="role__logo" src={role.logo} alt="" />
        <div className="role__titles">
          <p className="role__title">{role.title}</p>
          <p className="role__company">{role.company}</p>
        </div>
        <div className="role__loc">
          <Pin color="rgba(0,0,0,0.6)" />
          <p>{role.location}</p>
        </div>
      </div>
      <div className="role__body">
        <ul>
          {role.points.map((pt, i) => (
            <li key={i}>{pt}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// Horizontal scroll (reference component): H = track width − container width,
// hold = round(0.45 × viewport height), section height = viewport + H + hold.
// Over the section's scroll progress the track maps [0, H/(H+hold), 1] →
// [0, −H, −H], smoothed by a spring (stiffness 120, damping 30, mass 0.4).
export function Journey() {
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ H: 0, hold: 0, vh: 900 });
  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current || !scroller.current) return;
      const vh = window.innerHeight;
      const H = Math.max(0, track.current.scrollWidth - scroller.current.clientWidth);
      setDims({ H, hold: H > 0 ? Math.round(vh * 0.45) : 0, vh });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    if (scroller.current) ro.observe(scroller.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  const { scrollYProgress } = useScroll({ target: scroller, offset: ["start start", "end end"] });
  const G = dims.H + dims.hold > 0 ? dims.H / (dims.H + dims.hold) : 1;
  const raw = useTransform(scrollYProgress, [0, G, 1], [0, -dims.H, -dims.H]);
  const x = useSpring(raw, TRACK_SPRING);

  return (
    <section className="journey">
      <Separator />
      <div className="journey__scroller" ref={scroller} style={{ height: dims.vh + dims.H + dims.hold }}>
        <div className="journey__sticky">
          <div className="journey__head">
            <SectionHead label={journey.label} title={journey.title} body={journey.body} />
          </div>
          <div className="journey__viewport">
            <motion.div className="journey__track" ref={track} style={{ x }}>
              <div className="journey__line" />
              {journey.roles.map((role, i) => (
                <div key={i} className={`role role--${role.pill}${"current" in role && role.current ? " role--current" : ""}`}>
                  {role.pill === "top" ? (
                    <>
                      <Marker role={role} />
                      <div className="role__stem" />
                      <RoleCard role={role} index={i} />
                    </>
                  ) : (
                    <>
                      <RoleCard role={role} index={i} />
                      <div className="role__stem" />
                      <Marker role={role} />
                    </>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
