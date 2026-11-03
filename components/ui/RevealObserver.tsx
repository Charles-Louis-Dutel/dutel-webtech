"use client";

import { useEffect } from "react";

/**
 * Ajoute la classe `in` aux éléments `.rv` et `[data-reveal]` lorsqu'ils entrent
 * dans la fenêtre, comme le script de la maquette. Sans IntersectionObserver ou
 * avec `prefers-reduced-motion`, tout est affiché immédiatement.
 */
export default function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".rv, [data-reveal]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
