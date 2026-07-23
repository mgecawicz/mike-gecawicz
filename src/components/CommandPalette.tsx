import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sections, socials, site } from "../content";

type Command = {
  id: string;
  label: string;
  hint: string;
  run: () => void;
};

/**
 * ⌘K command palette: fuzzy-filtered navigation, links, and a couple of
 * toys (CRT mode, particle scatter). Keyboard-first, fully hand-rolled.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    setCopied(false);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const nav = sections.map((s) => ({
      id: `nav-${s.id}`,
      label: `Go to ${s.label}`,
      hint: s.index,
      run: () => {
        document
          .getElementById(s.id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    }));
    const links = socials.map((s) => ({
      id: `link-${s.label}`,
      label: `Open ${s.label}`,
      hint: "↗",
      run: () => window.open(s.href, "_blank", "noreferrer"),
    }));
    return [
      ...nav,
      {
        id: "copy-email",
        label: `Copy email — ${site.email}`,
        hint: "⧉",
        run: () => {
          navigator.clipboard?.writeText(site.email);
          setCopied(true);
          setTimeout(close, 650);
        },
      },
      ...links,
      {
        id: "crt",
        label: "Toggle CRT mode",
        hint: "▓",
        run: () => document.documentElement.classList.toggle("crt"),
      },
      {
        id: "scatter",
        label: "Detonate the hero particles",
        hint: "✸",
        run: () => window.dispatchEvent(new CustomEvent("mg:detonate")),
      },
    ];
  }, [close]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase().replace(/\s/g, "");
    // subsequence fuzzy match, ranked by span tightness
    return commands
      .map((c) => {
        const l = c.label.toLowerCase();
        let i = 0;
        let first = -1;
        let last = -1;
        for (let j = 0; j < l.length && i < q.length; j++) {
          if (l[j] === q[i]) {
            if (first < 0) first = j;
            last = j;
            i++;
          }
        }
        return i === q.length ? { c, score: last - first } : null;
      })
      .filter((x): x is { c: Command; score: number } => x !== null)
      .sort((a, b) => a.score - b.score)
      .map((x) => x.c);
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setActive(0);
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && filtered[active]) {
      const cmd = filtered[active];
      cmd.run();
      if (cmd.id !== "copy-email") close();
    }
  };

  return (
    <div className="palette-backdrop" onClick={close} role="dialog" aria-modal>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette-head">
          <span className="palette-prompt">›</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Type a command…"
            aria-label="Command"
            spellCheck={false}
          />
          <kbd>esc</kbd>
        </div>
        <ul className="palette-list">
          {filtered.length === 0 && (
            <li className="palette-empty">no match — try “crt”</li>
          )}
          {filtered.map((c, i) => (
            <li key={c.id}>
              <button
                className={i === active ? "is-active" : ""}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  c.run();
                  if (c.id !== "copy-email") close();
                }}
              >
                <span>
                  {copied && c.id === "copy-email" ? "Copied ✓" : c.label}
                </span>
                <span className="palette-hint">{c.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
