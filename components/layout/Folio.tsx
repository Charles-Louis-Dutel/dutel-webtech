"use client";

import { useEffect, useState } from "react";

type State = { n: string; name: string; dark: boolean };

/** Rail vertical (≥ 1200 px) indiquant la section en cours de lecture. */
export default function Folio() {
  const [state, setState] = useState<State>({ n: "00", name: "Accueil", dark: false });

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-folio]"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          setState({
            n: el.dataset.folio ?? "00",
            name: el.dataset.name ?? "",
            dark: el.hasAttribute("data-dark"),
          });
        }),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`folio${state.dark ? " on-dark" : ""}`} aria-hidden="true">
      <span className="mono">
        <b>{state.n}</b>
        <i />
        <em>{state.name}</em>
      </span>
    </div>
  );
}
