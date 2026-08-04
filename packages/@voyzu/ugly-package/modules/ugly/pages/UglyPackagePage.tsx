import type { ReactNode } from "react";

import styles from "./ugly-package.module.css";

interface UglyPackagePageProps {
  active: "home" | "freedom" | "dependencies";
  children: ReactNode;
}

export function UglyPackagePage({ active, children }: UglyPackagePageProps) {
  const pageClass = active === "home"
    ? styles.home
    : active === "freedom"
      ? styles.freedom
      : styles.dependencies;

  return (
    <div className={`${styles.everything} ${pageClass}`}>
      <nav className={styles.ourOwnTopNav} aria-label="Ugly Package">
        <a href="/ugly-package" aria-current={active === "home" ? "page" : undefined}>Home</a>
        <a
          href="/ugly-package/developer-freedom"
          aria-current={active === "freedom" ? "page" : undefined}
        >
          the bare minimum
        </a>
        <a
          href="/ugly-package/byo-dependencies"
          aria-current={active === "dependencies" ? "page" : undefined}
        >
          BYO Dependencies
        </a>
      </nav>
      {children}
    </div>
  );
}
