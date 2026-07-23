// One shared IntersectionObserver powers every scroll reveal on the page.
let observer: IntersectionObserver | null = null;

function get(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            get().unobserve(e.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
  }
  return observer;
}

export function observeReveal(el: Element | null) {
  if (!el) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.classList.add("is-in");
    return () => {};
  }
  get().observe(el);
  return () => get().unobserve(el);
}
