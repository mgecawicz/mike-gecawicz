import { network } from "../content";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="mono-label">© {new Date().getFullYear()} MIKE GECAWICZ</p>
          <ul className="footer-net">
            <li className="mono-label footer-net-head">ELSEWHERE ON MKGZ.ME</li>
            {network.map((n) => (
              <li key={n.label}>
                <a
                  className="mono-label footer-net-link"
                  href={n.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                >
                  {n.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mono-label footer-colophon">
          REACT 19 · VITE · HAND-ROLLED WEBGL2 · ZERO ANIMATION LIBRARIES
          <br />
          TYPE: SPACE GROTESK / INTER / DEPARTURE MONO
          <br />
          THE 2024 VUE SITE LIVES ON IN <code>/legacy</code>
        </p>
        <p className="mono-label footer-egg" title="try the Konami code">
          ↑↑↓↓←→←→BA
        </p>
      </div>
    </footer>
  );
}
