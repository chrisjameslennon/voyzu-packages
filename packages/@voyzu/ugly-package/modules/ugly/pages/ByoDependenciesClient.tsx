"use client";

import { useState } from "react";
import { randomCatName } from "cat-names";

import { UglyPackagePage } from "./UglyPackagePage";
import styles from "./ugly-package.module.css";

export function ByoDependenciesClient({ packageJsonHtml }: { packageJsonHtml: string }) {
  const [catName, setCatName] = useState("No cat has been named yet.");

  return (
    <UglyPackagePage active="dependencies">
      <main className={styles.dependenciesContent}>
        <h1>BYO Dependencies</h1>
        <div className={styles.dependenciesOverview}>
          <p className={styles.dependenciesIntroduction}>
            Every Voyzu package can declare and use its own npm dependencies. They are installed into the composed
            runtime alongside the package.
          </p>
          <aside className={styles.dependencyExplanation}>
            <p>
              This <code>@voyzu/ugly-package</code> package depends on the{" "}
              <a href="https://www.npmjs.com/package/cat-names"><code>cat-names</code></a> npm package.
            </p>
            <div
              className={styles.dependencySnippet}
              dangerouslySetInnerHTML={{ __html: packageJsonHtml }}
            />
          </aside>
        </div>
        <div className={styles.catCard}>
          <img
            className={styles.catPicture}
            src="/@voyzu/ugly-package/dofle.jpg"
            alt="A relaxed cat bringing some cat vibes"
          />
          <div className={styles.catControls}>
            <button type="button" onClick={() => setCatName(randomCatName())}>
              generate random cat name
            </button>
            <output className={styles.catName} aria-live="polite">{catName}</output>
          </div>
        </div>
        <p className={styles.assetNote}>
          The cat image belongs to this package too. It is shipped in <code>public-assets</code> and published into
          the package&apos;s own static URL namespace when Voyzu composes the installation.
        </p>
      </main>
    </UglyPackagePage>
  );
}
