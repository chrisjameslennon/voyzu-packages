import { UglyPackagePage } from "./UglyPackagePage";
import styles from "./ugly-package.module.css";

export function DeveloperFreedomPage() {
  return (
    <UglyPackagePage active="freedom">
      <main className={styles.freedomContent}>
        <h1>the bare minimum</h1>
        <p className={styles.ransomNote}>
          Voyzu supplies the platform. The package developer controls the experience inside the package.
        </p>
        <div className={styles.badColumns}>
          <section>
            <h2>What Voyzu requires</h2>
            <ul>
              <li>
                A valid <a href="https://voyzu.gitbook.io/docs/voyzu-platform-guide/package-contract">package.json</a> and <a href="https://voyzu.gitbook.io/docs/voyzu-platform-guide/package-contract">voyzu.package.ts</a>
              </li>
              <li>
                At least one module. Modules must adhere to the <a href="https://voyzu.gitbook.io/docs/voyzu-platform-guide/module-contract">module contract</a>.
              </li>
            </ul>
          </section>
        </div>
        <p className={styles.lastWord}>Valid does not necessarily mean tasteful.</p>
      </main>
    </UglyPackagePage>
  );
}
