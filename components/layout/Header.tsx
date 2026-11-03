"use client";

import Link from "next/link";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { navLinks } from "@/lib/site";

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export default function Header() {
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`hdr${scrolled || open ? " scrolled" : ""}`}>
      <div className="wrap nav">
        <Link className="brand" href="/" aria-label="Dutel Web & Tech — accueil">
          <span className="w">Dutel</span>
          <span className="t">Web &amp; Tech</span>
        </Link>

        <nav aria-label="Navigation principale">
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-r">
          <button
            type="button"
            className="menu-btn"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            <i aria-hidden="true" />
          </button>
          <Link className="pill" href="/#contact">
            Écrire <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Navigation mobile (< 680 px) */}
      <nav id={panelId} className="menu-panel" aria-label="Navigation mobile" hidden={!open}>
        <ul>
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
