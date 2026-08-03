import { UglyPackagePage } from "./UglyPackagePage";
import styles from "./ugly-package.module.css";

export function DeveloperFreedomPage() {
  return (
    <UglyPackagePage active="freedom">
      <main className={styles.freedomContent}>
        <h1>Developer Freedom</h1>
        <p className={styles.ransomNote}>
          Voyzu supplies the platform. The package developer still controls the experience inside the package.
        </p>
        <div className={styles.badColumns}>
          <section>
            <h2>What Voyzu requires</h2>
            <ul>
              <li>A valid package identity and manifest</li>
              <li>A registered module with real page routes</li>
              <li>Navigation that points to a registered route</li>
            </ul>
          </section>
          <section>
            <h2>What this package refuses</h2>
            <ul>
              <li>The shared component library</li>
              <li>The shared visual language</li>
              <li>A left navigation panel</li>
            </ul>
          </section>
        </div>
        <p className={styles.lastWord}>Valid does not necessarily mean tasteful.</p>
      </main>
    </UglyPackagePage>
  );
}
