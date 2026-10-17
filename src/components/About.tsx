import { about } from "../content";
import { FadeIn, Label, RevealTitle, Separator } from "./Section";

// Polaroid (reference component settings): 69% of the photo column, max 512px,
// aspect .735, rotated -2deg, white frame with a 16px top strip, 16px sides and a
// calc(100% - 76px) photo; "light" shadow; light-leak + 12% vignette overlays.
// Hover animation is disabled on the reference, so there is none here.
export function About() {
  return (
    <section className="about" id="about-me">
      <Separator />
      <div className="about__row">
        <div className="about__photo-col">
          <div className="polaroid">
            <div className="polaroid__card">
              <div className="polaroid__strip" />
              <div className="polaroid__frame-wrap">
                <div className="polaroid__frame">
                  <img src={about.photo} alt="" />
                  <div className="polaroid__glow" />
                  <div className="polaroid__vignette" />
                </div>
              </div>
            </div>
            <div className="polaroid__grain" />
          </div>
        </div>
        <div className="about__text-col">
          <div className="about__heading">
            <Label text={about.label} />
            <RevealTitle text={about.title} />
          </div>
          <FadeIn className="about__paras">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </FadeIn>
          <p className="signature">{about.signature}</p>
        </div>
      </div>
    </section>
  );
}
