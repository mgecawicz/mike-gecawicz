import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import "./styles/sections.css";
import App from "./App";

// /pay is the one other page; Amplify rewrites every path to index.html.
const Pay = lazy(() => import("./components/Pay"));
const isPay = /^\/pay\/?$/.test(window.location.pathname);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isPay ? (
      <Suspense fallback={null}>
        <Pay />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
);
