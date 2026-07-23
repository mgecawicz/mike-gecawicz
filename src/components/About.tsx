import { about } from "../content";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { DitherPortrait } from "./DitherPortrait";

export function About() {
  return (
    <section className="section about" id="about">
      <SectionHeading index="01" title="About" />
      <div className="about-grid">
        <Reveal from="left" className="about-portrait">
          <DitherPortrait src="/media/me.jpg" alt="Portrait of Mike Gecawicz" />
        </Reveal>
        <div className="about-copy">
          {about.intro.map((p, i) => (
            <Reveal key={i} delay={i * 90}>
              <p className="about-para">{p}</p>
            </Reveal>
          ))}
          <Reveal delay={280} from="fade">
            <dl className="about-facts">
              {about.currently.map((f) => (
                <div className="about-fact" key={f.label}>
                  <dt className="mono-label">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
