import { site, socials } from "../content";
import { useScramble } from "../hooks/useScramble";
import { Reveal } from "./Reveal";
import { ScrambleLink } from "./ScrambleLink";
import { SectionHeading } from "./SectionHeading";

export function Contact() {
  const { display, scramble } = useScramble(site.email);
  return (
    <section className="section contact" id="contact">
      <SectionHeading index="05" title="Contact" />
      <Reveal>
        <p className="contact-lede">
          Have a system to build, a simulation to run, or a weird idea that
          needs someone who's done hardware, backend, and Blender?
        </p>
      </Reveal>
      <Reveal delay={100}>
        <a
          className="contact-email"
          href={`mailto:${site.email}`}
          onMouseEnter={scramble}
          onFocus={scramble}
          data-cursor="mail"
        >
          {display}
        </a>
      </Reveal>
      <Reveal delay={200} from="fade">
        <ul className="contact-socials">
          {socials.map((s) => (
            <li key={s.label}>
              <ScrambleLink text={s.label} href={s.href} external />
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={260} from="fade">
        <p className="contact-hint mono-label">
          OR PRESS <kbd>⌘K</kbd> ANYWHERE
        </p>
      </Reveal>
    </section>
  );
}
