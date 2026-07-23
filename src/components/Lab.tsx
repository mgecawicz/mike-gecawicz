import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { CollatzTerminal } from "./demos/CollatzTerminal";
import { BoidsCanvas } from "./demos/BoidsCanvas";
import { AStarMaze } from "./demos/AStarMaze";

const demos = [
  {
    id: "collatz",
    title: "Collatz, in 115 bytes",
    body: "The number you enter is fed to the actual collatz.wasm binary my previous site served — C, compiled to WebAssembly, 115 bytes on the wire. The chart traces the hailstone orbit on a log scale.",
    el: <CollatzTerminal />,
  },
  {
    id: "boids",
    title: "The flock",
    body: "Craig Reynolds' three rules — separation, alignment, cohesion — ported from the Boid.ts I wrote for the old site, with the same radii and weights. A spatial hash lets four times the flock run at 60fps. Your cursor is a predator; hold down to become food.",
    el: <BoidsCanvas />,
  },
  {
    id: "astar",
    title: "A* through the maze",
    body: "A recursive backtracker carves the maze in front of you, then A* hunts the exit with a binary-heap frontier — cyan is the open set, smoke is everywhere it looked, amber is the answer. Rebuilt from my C++ terminal original.",
    el: <AStarMaze />,
  },
];

export function Lab() {
  return (
    <section className="section lab" id="lab">
      <SectionHeading
        index="03"
        title="Lab"
        note="Not screenshots. Everything below is running, right now, in your browser."
      />
      {demos.map((d, i) => (
        <div className="lab-item" key={d.id}>
          <Reveal from={i % 2 ? "right" : "left"} className="lab-copy">
            <h3 className="lab-title">{d.title}</h3>
            <p className="lab-body">{d.body}</p>
          </Reveal>
          <Reveal delay={120} from="fade" className="lab-stage">
            {d.el}
          </Reveal>
        </div>
      ))}
    </section>
  );
}
