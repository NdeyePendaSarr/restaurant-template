"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

const liens = [
  { href: "/", label: "Accueil" },
  { href: "/menu", label: "Carte" },
  { href: "/a-propos", label: "À propos" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const actif = (href: string) => (pathname === href ? "active" : "");
  const current = (href: string) => (pathname === href ? "page" : undefined);

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <Link href="/" className="logo" aria-label={site.nom}>
            {site.nom.split(" ")[0]} <span>{site.nom.split(" ").slice(1).join(" ")}</span>
          </Link>
          <nav className="nav" aria-label="Navigation principale">
            {liens.map((l) => (
              <Link key={l.href} href={l.href} className={actif(l.href)} aria-current={current(l.href)}>
                {l.label}
              </Link>
            ))}
            <Link href="/reservation" className="nav-cta">Réserver</Link>
          </nav>
          <button
            type="button"
            className="burger"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>
      <nav className={`mobile-nav ${open ? "open" : ""}`} id="mobile-nav" aria-label="Navigation mobile">
        {liens.map((l) => (
          <Link key={l.href} href={l.href} className={actif(l.href)} aria-current={current(l.href)}>
            {l.label}
          </Link>
        ))}
        <Link href="/reservation" className="nav-cta">Réserver une table</Link>
      </nav>
    </>
  );
}
