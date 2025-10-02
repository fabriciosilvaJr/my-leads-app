"use client";
import React, { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LeadsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  const isNew = pathname === "/leads/new";
  const isList = pathname === "/leads" || pathname === "/leads/";

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>L0gik Leads</h1>
          <nav style={styles.nav}>
            <Link href="/leads/new">
              <button
                aria-current={isNew ? "page" : undefined}
                style={{
                  ...styles.navButton,
                  ...(isNew ? styles.navButtonActive : {}),
                }}
              >
                Formulário
              </button>
            </Link>

            <Link href="/leads">
              <button
                aria-current={isList ? "page" : undefined}
                style={{
                  ...styles.navButton,
                  ...(isList ? styles.navButtonActive : {}),
                }}
              >
                Painel Admin
              </button>
            </Link>
          </nav>
        </div>
      </header>

      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles: { [k: string]: CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  header: {
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "1.35rem",
    fontWeight: "700",
    color: "#5b21b6",
  },
  nav: { display: "flex", gap: "0.75rem" },
  navButton: {
    padding: "0.45rem 0.9rem",
    borderRadius: "0.5rem",
    border: "none",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 600,
    transition: "all 0.15s ease",
  },
  navButtonActive: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    boxShadow: "0 6px 14px -6px rgba(79,70,229,0.6)",
  },
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
  },
};
