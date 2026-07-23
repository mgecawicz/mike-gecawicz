import { jobs, education } from "../content";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Experience() {
  return (
    <section className="section experience" id="experience">
      <SectionHeading
        index="02"
        title="Experience"
        note="A decade across backend systems, native apps, hardware prototypes, and one patented flavor machine."
      />
      <ol className="xp-list">
        {jobs.map((job, i) => (
          <Reveal as="li" key={job.company} delay={Math.min(i * 60, 240)} className="xp-item">
            <div className="xp-span mono-label">{job.span}</div>
            <div className="xp-main">
              <h3 className="xp-company">{job.company}</h3>
              <p className="xp-role">
                {job.role} <span className="xp-where">· {job.where}</span>
              </p>
              {job.notes.map((n, j) => (
                <p className="xp-note" key={j}>
                  {n}
                </p>
              ))}
              {job.artifacts && (
                <ul className="xp-artifacts">
                  {job.artifacts.map((a) => (
                    <li key={a.label}>
                      <span className="mono-label xp-artifact-label">
                        {a.href ? (
                          <a href={a.href} target="_blank" rel="noreferrer" data-cursor="link">
                            {a.label} ↗
                          </a>
                        ) : (
                          a.label
                        )}
                      </span>
                      <span className="xp-artifact-detail">{a.detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="xp-index mono-label">
              {String(jobs.length - i).padStart(2, "0")}
            </div>
          </Reveal>
        ))}
      </ol>
      <Reveal from="fade">
        <div className="xp-edu">
          {education.map((e) => (
            <p key={e.school}>
              <span className="xp-edu-school">{e.school}</span>
              <span className="xp-edu-detail"> · {e.detail}</span>
            </p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
