import type { ReactNode } from "react";

import styles from "./ugly-package.module.css";

interface UglyPackagePageProps {
  active: "home" | "freedom";
  children: ReactNode;
}

export function UglyPackagePage({ active, children }: UglyPackagePageProps) {
  return (
    <div className={`${styles.everything} ${active === "home" ? styles.home : styles.freedom}`}>
      <nav className={styles.ourOwnTopNav} aria-label="Ugly Package">
        <a href="/ugly-package" aria-current={active === "home" ? "page" : undefined}>Home</a>
        <a
          href="/ugly-package/developer-freedom"
          aria-current={active === "freedom" ? "page" : undefined}
        >
          Developer freedom
        </a>
      </nav>
      {children}
    </div>
  );
}
