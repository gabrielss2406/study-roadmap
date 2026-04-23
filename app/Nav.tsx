"use client";
// app/Nav.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const path = usePathname();

  const links = [
    { href: "/",          label: "Linha do Tempo" },
    { href: "/entregas",  label: "Entregáveis"    },
  ];

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", height: 52,
      background: "#0a0f1a",
      borderBottom: "1px solid #1a2234",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <span style={{
        fontFamily: "monospace", fontSize: 12, letterSpacing: 2,
        color: "#4F6EF7", textTransform: "uppercase",
      }}>
        Gabriel · Roadmap
      </span>

      <div style={{ display: "flex", gap: 4 }}>
        {links.map(({ href, label }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              padding: "6px 14px", borderRadius: 6,
              fontSize: 13, textDecoration: "none",
              background: active ? "#4F6EF720" : "transparent",
              color: active ? "#4F6EF7" : "#64748b",
              border: active ? "1px solid #4F6EF740" : "1px solid transparent",
              transition: "all 0.15s",
            }}>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
