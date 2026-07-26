import {
  access,
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const applicationRoot = resolve(repositoryRoot, "apps/web");
const platformRoot = resolve(repositoryRoot, "../voyzu");
const repositoryNodeModules = resolve(repositoryRoot, "node_modules");
const applicationPackages = resolve(applicationRoot, "packages/@voyzu");
const applicationNodeModules = resolve(applicationRoot, "node_modules/@voyzu");
const applicationBusinessPackage = resolve(
  applicationRoot,
  "packages/@voyzu-modules/core",
);
const applicationBusinessNodeModule = resolve(
  applicationRoot,
  "node_modules/@voyzu-modules/core",
);
const platformPackages = resolve(platformRoot, "packages/@voyzu");
const businessPackage = resolve(
  repositoryRoot,
  "packages/@voyzu-modules/core",
);

const linkedPlatformPackages = [
  "api",
  "api-reference",
  "capability",
  "types",
  "ui-components",
  "ui-layout",
  "ui-style",
  "ui-surface",
];

const retainedPlatformModules = new Set(["auth", "capability", "users"]);

function assertInside(parent, child) {
  if (!child.startsWith(parent + sep)) {
    throw new Error(`Path escapes expected parent: ${child}`);
  }
}

async function replaceWithDirectoryLink(target, source) {
  await access(source);
  await rm(target, { recursive: true, force: true });
  await mkdir(dirname(target), { recursive: true });
  await symlink(
    source,
    target,
    process.platform === "win32" ? "junction" : "dir",
  );
}

async function composeModules() {
  const target = resolve(applicationPackages, "modules");
  const platform = resolve(platformPackages, "modules");

  for (const entry of await readdir(target, { withFileTypes: true })) {
    if (
      entry.isDirectory()
      && !retainedPlatformModules.has(entry.name)
    ) {
      await rm(resolve(target, entry.name), {
        recursive: true,
        force: true,
      });
    }
  }

  for (const moduleName of retainedPlatformModules) {
    const targetModule = resolve(target, moduleName);
    await rm(targetModule, { recursive: true, force: true });
    await cp(resolve(platform, moduleName), targetModule, {
      recursive: true,
    });
  }

  const platformPackageJson = JSON.parse(
    await readFile(resolve(platform, "package.json"), "utf8"),
  );
  platformPackageJson.exports = Object.fromEntries(
    Object.entries(platformPackageJson.exports).filter(([exportPath]) => {
      const moduleName = exportPath.split("/")[1];
      return retainedPlatformModules.has(moduleName);
    }),
  );
  await writeFile(
    resolve(target, "package.json"),
    `${JSON.stringify(platformPackageJson, null, 2)}\n`,
  );

  await replaceWithDirectoryLink(applicationBusinessPackage, businessPackage);
  await replaceWithDirectoryLink(
    applicationBusinessNodeModule,
    businessPackage,
  );
}

async function linkBusinessDevelopmentDependencies() {
  await replaceWithDirectoryLink(
    resolve(repositoryNodeModules, "@voyzu-modules/core"),
    businessPackage,
  );
  for (const packageName of linkedPlatformPackages) {
    await replaceWithDirectoryLink(
      resolve(repositoryNodeModules, `@voyzu/${packageName}`),
      resolve(platformPackages, packageName),
    );
  }

  await replaceWithDirectoryLink(
    resolve(repositoryNodeModules, "@voyzu/modules"),
    resolve(applicationPackages, "modules"),
  );

  for (const packageName of [
    "archiver",
    "next",
    "react",
    "react-dom",
    "server-only",
  ]) {
    await replaceWithDirectoryLink(
      resolve(repositoryNodeModules, packageName),
      resolve(applicationRoot, `node_modules/${packageName}`),
    );
  }
}

async function overlayDevelopmentAssets() {
  await cp(
    resolve(repositoryRoot, "infra"),
    resolve(applicationRoot, "infra"),
    { recursive: true },
  );

  await cp(
    resolve(repositoryRoot, "scripts/db"),
    resolve(applicationRoot, "scripts/db"),
    { recursive: true },
  );
}

async function rewriteBusinessImports(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      await rewriteBusinessImports(path);
      continue;
    }

    if (!/\.(?:json|ts|tsx)$/.test(entry.name)) {
      continue;
    }

    const current = await readFile(path, "utf8");
    let updated = current.replaceAll(
      "@voyzu/modules/",
      "@voyzu-modules/core/",
    );

    for (const moduleName of retainedPlatformModules) {
      updated = updated.replaceAll(
        `@voyzu-modules/core/${moduleName}`,
        `@voyzu/modules/${moduleName}`,
      );
    }

    if (updated !== current) {
      await writeFile(path, updated);
    }
  }
}

async function configureGeneratedApplication() {
  const rootPackageJsonPath = resolve(applicationRoot, "package.json");
  const rootPackageJson = JSON.parse(
    await readFile(rootPackageJsonPath, "utf8"),
  );
  const businessWorkspaces = [
    "packages/@voyzu-modules/core",
  ];

  if (
    businessWorkspaces.some(
      (workspace) => !rootPackageJson.workspaces.includes(workspace),
    )
  ) {
    for (const workspace of businessWorkspaces) {
      if (!rootPackageJson.workspaces.includes(workspace)) {
        rootPackageJson.workspaces.push(workspace);
      }
    }
    await writeFile(
      rootPackageJsonPath,
      `${JSON.stringify(rootPackageJson, null, 2)}\n`,
    );
  }

  const webPackageJsonPath = resolve(applicationRoot, "apps/web/package.json");
  const webPackageJson = JSON.parse(
    await readFile(webPackageJsonPath, "utf8"),
  );

  let webPackageChanged = false;
  for (const packageName of [
    "@voyzu-modules/core",
  ]) {
    if (!webPackageJson.dependencies[packageName]) {
      webPackageJson.dependencies[packageName] = "*";
      webPackageChanged = true;
    }
  }

  if (webPackageChanged) {
    await writeFile(
      webPackageJsonPath,
      `${JSON.stringify(webPackageJson, null, 2)}\n`,
    );
  }

  const webTsconfigPath = resolve(applicationRoot, "apps/web/tsconfig.json");
  const webTsconfig = JSON.parse(await readFile(webTsconfigPath, "utf8"));

  if (!webTsconfig.compilerOptions.preserveSymlinks) {
    webTsconfig.compilerOptions.preserveSymlinks = true;
    await writeFile(
      webTsconfigPath,
      `${JSON.stringify(webTsconfig, null, 2)}\n`,
    );
  }

  await rewriteBusinessImports(resolve(applicationRoot, "apps"));
}

async function configureTurbopackRoot() {
  const nextConfigPath = resolve(
    applicationRoot,
    "apps/web/next.config.ts",
  );
  const currentConfig = await readFile(nextConfigPath, "utf8");
  let configured = currentConfig;

  if (!configured.includes('"@voyzu-modules/core"')) {
    configured = configured.replace(
      '"@voyzu/modules",',
      '"@voyzu/modules",\n    "@voyzu-modules/core",',
    );
  }

  if (!configured.includes("turbopack:")) {
    configured = configured.replace(
      "const nextConfig: NextConfig = {",
      [
        "const nextConfig: NextConfig = {",
        "  turbopack: {",
        `    root: ${JSON.stringify(resolve(repositoryRoot, ".."))},`,
        "    resolveAlias: {",
        `      "@voyzu-modules/core": ${JSON.stringify(businessPackage)},`,
        "    },",
        "  },",
      ].join("\n"),
    );
  } else if (!configured.includes("resolveAlias:")) {
    configured = configured.replace(
      `  turbopack: { root: ${JSON.stringify(resolve(repositoryRoot, ".."))} },`,
      [
        "  turbopack: {",
        `    root: ${JSON.stringify(resolve(repositoryRoot, ".."))},`,
        "    resolveAlias: {",
        `      "@voyzu-modules/core": ${JSON.stringify(businessPackage)},`,
        "    },",
        "  },",
      ].join("\n"),
    );
  }

  if (configured === currentConfig) {
    return;
  }

  await writeFile(nextConfigPath, configured);
}

async function main() {
  assertInside(repositoryRoot, applicationRoot);
  await access(resolve(applicationRoot, "package.json"));
  await access(resolve(platformRoot, "package.json"));

  console.log("Linking local Voyzu platform packages...");
  for (const packageName of linkedPlatformPackages) {
    const platformPackage = resolve(platformPackages, packageName);
    await replaceWithDirectoryLink(
      resolve(applicationPackages, packageName),
      platformPackage,
    );
    await replaceWithDirectoryLink(
      resolve(applicationNodeModules, packageName),
      platformPackage,
    );
  }

  console.log("Composing platform and business modules...");
  await composeModules();

  console.log("Linking business-package development dependencies...");
  await linkBusinessDevelopmentDependencies();

  console.log("Configuring the generated application package split...");
  await configureGeneratedApplication();

  console.log("Overlaying business database and development scripts...");
  await overlayDevelopmentAssets();

  console.log("Configuring linked-package development root...");
  await configureTurbopackRoot();

  console.log("Voyzu development application composed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
