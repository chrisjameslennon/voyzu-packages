import {
  access,
  cp,
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
const applicationPackages = resolve(applicationRoot, "packages/@voyzu");
const applicationNodeModules = resolve(applicationRoot, "node_modules/@voyzu");
const platformPackages = resolve(platformRoot, "packages/@voyzu");
const businessPackages = resolve(repositoryRoot, "packages/@voyzu");

const linkedPlatformPackages = [
  "api",
  "api-reference",
  "capability",
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
  await symlink(
    source,
    target,
    process.platform === "win32" ? "junction" : "dir",
  );
}

async function composeModules() {
  const target = resolve(applicationPackages, "modules");
  const platform = resolve(platformPackages, "modules");
  const business = resolve(businessPackages, "modules");

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

  for (const entry of await readdir(business, { withFileTypes: true })) {
    if (!entry.isDirectory() || retainedPlatformModules.has(entry.name)) {
      continue;
    }

    await cp(
      resolve(business, entry.name),
      resolve(target, entry.name),
      { recursive: true },
    );
  }

  await cp(
    resolve(business, "package.json"),
    resolve(target, "package.json"),
  );
}

async function composeTypes() {
  const target = resolve(applicationPackages, "types");
  const platform = resolve(platformPackages, "types");
  const business = resolve(businessPackages, "types");
  const generatedIndexes = new Map();

  for (const relativePath of [
    "src/index.ts",
    "src/modules/index.ts",
    "src/params/index.ts",
  ]) {
    generatedIndexes.set(
      relativePath,
      await readFile(resolve(target, relativePath), "utf8"),
    );
  }

  await cp(platform, target, { recursive: true });
  await cp(business, target, { recursive: true });

  for (const [relativePath, contents] of generatedIndexes) {
    await writeFile(resolve(target, relativePath), contents);
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

async function configureTurbopackRoot() {
  const nextConfigPath = resolve(
    applicationRoot,
    "apps/web/next.config.ts",
  );
  const currentConfig = await readFile(nextConfigPath, "utf8");

  if (currentConfig.includes("turbopack:")) {
    return;
  }

  const configured = currentConfig.replace(
    "const nextConfig: NextConfig = {",
    [
      "const nextConfig: NextConfig = {",
      `  turbopack: { root: ${JSON.stringify(resolve(repositoryRoot, ".."))} },`,
    ].join("\n"),
  );

  if (configured === currentConfig) {
    throw new Error("Could not configure the generated Next.js application.");
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

  console.log("Composing shared and business types...");
  await composeTypes();

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
