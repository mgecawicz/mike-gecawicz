const WORDS = [
  "AGENTIC ENGINEER",
  "CREATIVE TECHNOLOGIST",
  "SIMULATION",
  "WEBASSEMBLY",
  "GENERATIVE DESIGN",
  "HARDWARE",
  "AWS",
];

export function Marquee() {
  const run = WORDS.map((w) => `${w} ✺ `).join("");
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <span>{run}</span>
        <span>{run}</span>
      </div>
    </div>
  );
}
