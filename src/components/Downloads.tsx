import { downloads, sections } from "../content";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Downloads() {
  if (downloads.length === 0) return null;
  const index =
    sections.find((s) => s.id === "software")?.index ?? "05";
  return (
    <section className="section downloads" id="software">
      <SectionHeading
        index={index}
        title="Software"
        note="Native apps, hosted right here. No store in between. These builds aren't notarized yet, so on first launch macOS will ask you to allow them under Privacy & Security."
      />
      <ul className="dl-list">
        {downloads.map((d, i) => (
          <Reveal as="li" key={d.name} delay={i * 70} className="dl-item">
            <div className="dl-main">
              <h3 className="dl-name">{d.name}</h3>
              <p className="dl-blurb">{d.blurb}</p>
            </div>
            <div className="dl-meta mono-label">
              {d.version} · {d.requires} · {d.size}
            </div>
            <a
              className="dl-btn mono-label"
              href={d.href}
              download
              data-cursor="link"
            >
              GET .DMG ↓
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
