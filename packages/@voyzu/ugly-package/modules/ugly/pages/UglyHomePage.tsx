import { UglyPackagePage } from "./UglyPackagePage";
import styles from "./ugly-package.module.css";

export function UglyHomePage() {
  return (
    <UglyPackagePage active="home">
      <main className={styles.homeContent}>
        <p className={styles.tinyIntroduction}>A COMPLETELY VALID VOYZU PACKAGE</p>
        <h1>Welcome to the Ugly Package!!!</h1>
        <p className={styles.loudParagraph}>
          This package illustrates the amount of freedom available to a Voyzu package developer.
        </p>
        <div className={styles.warningBox}>
          <strong>Warning:</strong> this is not a best-practice example. It is stubbornly doing its own thing.
        </div>
        <section className={styles.crookedSection}>
          <h2>No shared design system here</h2>
          <p>
            No Voyzu controls. No Voyzu layout helpers. No Voyzu styling. Just package-owned HTML and CSS,
            questionable colour choices, and entirely too many exclamation marks.
          </p>
        </section>
      </main>
    </UglyPackagePage>
  );
}
