import { useEffect, useState } from "react";
import { Preloader } from "./components/Preloader";
import { Cursor } from "./components/Cursor";
import { Hud } from "./components/Hud";
import { CommandPalette } from "./components/CommandPalette";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Lab } from "./components/Lab";
import { Work } from "./components/Work";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function App() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      i = e.key === KONAMI[i] ? i + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (i === KONAMI.length) {
        i = 0;
        document.documentElement.classList.toggle("crt");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("is-booted", booted);
  }, [booted]);

  return (
    <>
      {!booted && <Preloader onDone={() => setBooted(true)} />}
      <Cursor />
      <Hud />
      <CommandPalette />
      <div className="crt-overlay" aria-hidden="true" />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Lab />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
