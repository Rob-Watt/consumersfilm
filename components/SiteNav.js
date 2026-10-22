"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { navItems } from "../lib/nav";
import { site } from "../lib/site";

export default function SiteNav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef(null);
  const { session, openDialog, signOut } = useAuth();

  // Hide on scroll down, reveal on scroll up (like a24films.com).
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= 80 || y < last - 4) setHidden(false);
      else if (y > last + 4) setHidden(true);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (menuOpen && !dialog.open) dialog.showModal();
    if (!menuOpen && dialog.open) dialog.close();
  }, [menuOpen]);

  const isActive = (slug) => pathname?.startsWith(`/${slug}`);
  const closeMenu = () => setMenuOpen(false);

  // Top-right account links, like A24's "Become a member / Log in".
  const accountLinks = session
    ? [{ label: "Log out", onClick: signOut }]
    : [
        { label: "Sign up", onClick: () => openDialog("join") },
        { label: "Log in", onClick: () => openDialog("login") },
      ];

  return (
    <header className={`site-nav${hidden && !menuOpen ? " is-hidden" : ""}`}>
      <div className="site-nav__bar">
        <nav className="site-nav__primary" aria-label="Primary">
          <ul>
            {navItems.map((item, i) => (
              <li key={item.slug} style={{ "--i": i }}>
                <Link
                  href={`/${item.slug}/`}
                  className={`site-nav__link${isActive(item.slug) ? " is-active" : ""}`}
                  aria-current={isActive(item.slug) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/" className="site-nav__logo" style={{ "--i": navItems.length }}>
          {site.title}
        </Link>

        <div className="site-nav__end">
          <ul className="site-nav__account">
            {accountLinks.map(({ label, onClick }, i) => (
              <li key={label} style={{ "--i": navItems.length - 1 - i }}>
                <button type="button" className="site-nav__link" onClick={onClick}>
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="site-nav__menu-button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 8h18M3 16h18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="menu-drawer"
        aria-label="Menu"
        onClose={closeMenu}
        // A click on the dialog itself (not the panel) is a click on the backdrop.
        onClick={(e) => e.target === e.currentTarget && closeMenu()}
      >
        <div className="menu-drawer__panel">
          <button
            type="button"
            className="menu-drawer__close"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <nav aria-label="Menu">
            <ul>
              {navItems.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/${item.slug}/`}
                    className={`menu-drawer__link${isActive(item.slug) ? " is-active" : ""}`}
                    aria-current={isActive(item.slug) ? "page" : undefined}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="menu-drawer__account">
            {accountLinks.map(({ label, onClick }) => (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onClick();
                  }}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </header>
  );
}
