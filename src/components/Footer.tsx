export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <p className="mono-label">
          © {new Date().getFullYear()} MIKE GECAWICZ
        </p>
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
