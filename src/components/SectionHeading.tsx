import { Reveal } from "./Reveal";

export function SectionHeading({
  index,
  title,
  note,
}: {
  index: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="section-heading">
      <Reveal from="fade">
        <span className="section-index">{index}</span>
      </Reveal>
      <Reveal delay={60}>
        <h2 className="section-title">{title}</h2>
      </Reveal>
      {note && (
        <Reveal delay={140} from="fade">
          <p className="section-note">{note}</p>
        </Reveal>
      )}
      <Reveal delay={100} from="fade">
        <hr className="section-rule" />
      </Reveal>
    </div>
  );
}
