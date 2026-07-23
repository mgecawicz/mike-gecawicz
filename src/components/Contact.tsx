import { site, socials, sections } from "../content";
import { useScramble } from "../hooks/useScramble";
import { Reveal } from "./Reveal";
import { ScrambleLink } from "./ScrambleLink";
import { SectionHeading } from "./SectionHeading";

export function Contact() {
  const { display, scramble } = useScramble(site.email);
  return (
    <section className="section contact" id="contact">
      <SectionHeading
        index={sections.find((s) => s.id === "contact")?.index ?? "05"}
        title="Contact"
      />
      <Reveal>
        <p className="contact-lede">
          If you want to build something together, or you just have a strange
          idea you'd like to talk through, I'd genuinely love to hear it.
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
