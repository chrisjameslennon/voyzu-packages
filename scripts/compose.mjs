#!/usr/bin/env node

import { spawn } from "node:child_process";
import {
  access,
  mkdir,
  readFile,
  readdir,
  writeFile,
} from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const modulesRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packagesRoot = join(modulesRoot, "packages", "@voyzu-modules");
const runtimeRoot = join(modulesRoot, ".dev", "voyzu");
const webRoot = join(runtimeRoot, "apps", "web");
const surfaceRoot = join(webRoot, "app", "(web)");
const generatedRoot = join(surfaceRoot, "generated", "voyzu-packages");
const apiGeneratedRoot = join(
  webRoot,
  "app",
  "api",
  "generated",
  "voyzu-packages",
);

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function findFiles(directory, suffix) {
  if (!(await pathExists(directory))) {
    return [];
  }

  const entries = await readdir(directory, { withFileTypes: true });
  const matches = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      matches.push(...await findFiles(path, suffix));
    } else if (entry.isFile() && entry.name.endsWith(suffix)) {
      matches.push(path);
    }
  }

  return matches.sort();
}

function exportedTargets(value) {
  if (typeof value === "string") {
    return [value];
  }
  if (!value || typeof value !== "object") {
    return [];
  }
  return Object.values(value).flatMap(exportedTargets);
}

async function discoverPackages() {
  const entries = await readdir(packagesRoot, { withFileTypes: true });
  const packages = [];

  for (const entry of entries.filter((item) => item.isDirectory()).sort(
    (left, right) => left.name.localeCompare(right.name),
  )) {
    const directory = join(packagesRoot, entry.name);
    const manifestPath = join(directory, "package.json");

    if (!(await pathExists(manifestPath))) {
      console.log(`Skipping ${entry.name}: no package.json.`);
      continue;
    }

    const manifest = await readJson(manifestPath);
    if (manifest.voyzu?.["voyzu-package"] !== true) {
      console.log(
        `Skipping ${manifest.name || entry.name}: voyzu.voyzu-package is not true.`,
      );
      continue;
    }

    if (!manifest.name) {
      throw new Error(`Voyzu package has no name: ${manifestPath}`);
    }

    const modulesDirectory = join(directory, "modules");
    if (!(await pathExists(modulesDirectory))) {
      throw new Error(`${manifest.name} does not contain a modules directory.`);
    }

    const moduleEntries = (await readdir(modulesDirectory, {
      withFileTypes: true,
    })).filter((item) => item.isDirectory());
    const modules = [];
    for (const moduleEntry of moduleEntries) {
      const moduleFile = join(
        modulesDirectory,
        moduleEntry.name,
        "module.ts",
      );
      if (await pathExists(moduleFile)) {
        const expectedTarget = `./modules/${moduleEntry.name}/module.ts`;
        const exportedModule = Object.entries(manifest.exports ?? {}).find(
          ([, value]) => exportedTargets(value).includes(expectedTarget),
        );
        if (!exportedModule) {
          throw new Error(
            `${manifest.name} module ${moduleEntry.name} is not exported from package.json.`,
          );
        }
        const [exportPath] = exportedModule;
        modules.push({
          name: moduleEntry.name,
          importPath: `${manifest.name}${exportPath.slice(1)}`,
        });
      }
    }

    if (modules.length === 0) {
      throw new Error(
        `${manifest.name} must contain at least one modules/*/module.ts.`,
      );
    }

    const uiDomainFiles = await findFiles(
      join(directory, "ui-domain"),
      ".ui-domain.ts",
    );
    if (uiDomainFiles.length === 0) {
      throw new Error(
        `${manifest.name} must contain at least one *.ui-domain.ts file.`,
      );
    }

    const leftNavFiles = await findFiles(
      join(directory, "ui-domain"),
      ".left-nav.ts",
    );
    if (leftNavFiles.length !== uiDomainFiles.length) {
      throw new Error(
        `${manifest.name} must contain one *.left-nav.ts file per UI domain.`,
      );
    }

    if (!manifest.exports?.["./ui-domains"]) {
      throw new Error(`${manifest.name} must export ./ui-domains.`);
    }

    packages.push({
      name: manifest.name,
      workspace: relative(
        runtimeRoot,
        join(runtimeRoot, "packages", "@voyzu-modules", entry.name),
      ).replaceAll("\\", "/"),
      modules,
    });
    console.log(
      `Including ${manifest.name} (${modules.length} module${modules.length === 1 ? "" : "s"}).`,
    );
  }

  return packages.sort((left, right) => left.name.localeCompare(right.name));
}

function withoutPrevious(values, previousValues) {
  const previous = new Set(previousValues);
  return values.filter((value) => !previous.has(value));
}

async function updateWorkspaceMetadata(packages) {
  const runtimePackagePath = join(runtimeRoot, "package.json");
  const webPackagePath = join(webRoot, "package.json");
  const runtimePackage = await readJson(runtimePackagePath);
  const webPackage = await readJson(webPackagePath);
  const previousNames = runtimePackage.voyzu?.composedPackages ?? [];
  const previousWorkspaces = previousNames.map(
    (name) => `packages/${name}`,
  );
  const names = packages.map(({ name }) => name);
  const workspaces = packages.map(({ workspace }) => workspace);

  runtimePackage.workspaces = [
    ...withoutPrevious(runtimePackage.workspaces ?? [], previousWorkspaces),
    ...workspaces,
  ];
  runtimePackage.voyzu = {
    ...(runtimePackage.voyzu ?? {}),
    composedPackages: names,
  };

  webPackage.dependencies ??= {};
  for (const previousName of previousNames) {
    delete webPackage.dependencies[previousName];
  }
  for (const name of names) {
    webPackage.dependencies[name] = "*";
  }
  webPackage.dependencies = Object.fromEntries(
    Object.entries(webPackage.dependencies).sort(([left], [right]) =>
      left.localeCompare(right)
    ),
  );
  webPackage.voyzu = {
    ...(webPackage.voyzu ?? {}),
    composedPackages: names,
  };

  await writeJson(runtimePackagePath, runtimePackage);
  await writeJson(webPackagePath, webPackage);
}

async function updateNextConfig(packages) {
  const configPath = join(webRoot, "next.config.ts");
  const startMarker = "    // voyzu compose:packages:start";
  const endMarker = "    // voyzu compose:packages:end";
  let source = await readFile(configPath, "utf8");
  const managedBlockPattern = new RegExp(
    `\\n${startMarker.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}[\\s\\S]*?${endMarker.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\n`,
  );
  source = source.replace(managedBlockPattern, "\n");

  const block = [
    startMarker,
    ...packages.map(({ name }) => `    ${JSON.stringify(name)},`),
    endMarker,
  ].join("\n");
  const anchor = "  transpilePackages: [";
  if (!source.includes(anchor)) {
    throw new Error(`Could not find transpilePackages in ${configPath}.`);
  }

  source = source.replace(anchor, `${anchor}\n${block}`);
  await writeFile(configPath, source, "utf8");
}

async function updateTypeScriptConfig() {
  const configPath = join(webRoot, "tsconfig.json");
  const config = await readJson(configPath);
  config.compilerOptions ??= {};
  config.compilerOptions.preserveSymlinks = true;
  await writeJson(configPath, config);
}

function generatedRegistry(packages) {
  const imports = packages.map(
    ({ name }, index) =>
      `import uiDomains${index} from ${JSON.stringify(`${name}/ui-domains`)};`,
  );
  const domainNames = packages.map((_, index) => `...uiDomains${index}`);

  return `// Generated by voyzu compose. Do not edit.
import type {
  VoyzuComposedSurfaceDomain,
  VoyzuSurfaceNavGroup,
  VoyzuSurfaceRoute,
} from "@voyzu/ui-surface/types";

${imports.join("\n")}

const uiDomains = [${domainNames.join(", ")}];

export const composedPageRoutes: VoyzuSurfaceRoute[] = uiDomains.flatMap(
  (domain) => [...domain.pageRoutes],
);

export const composedLeftNav: VoyzuSurfaceNavGroup[] = uiDomains.flatMap(
  (domain) => [...domain.leftNav],
);

export const composedSurfaceDomains: VoyzuComposedSurfaceDomain[] = uiDomains.map(
  (domain) => {
    const defaultRoute = domain.pageRoutes.find(
      (route) => route.id === domain.topNavItem.routeId,
    );
    if (!defaultRoute) {
      throw new Error(
        \`UI domain \${domain.id} top-nav route \${domain.topNavItem.routeId} was not found.\`,
      );
    }

    return {
      id: domain.id,
      label: domain.topNavItem.label,
      defaultPath: defaultRoute.path,
      routePaths: domain.pageRoutes.map(({ id, path }) => ({ id, path })),
      leftNav: [...domain.leftNav],
    };
  },
);
`;
}

function generatedApiRegistry(packages) {
  const modules = packages.flatMap(({ modules }) => modules);
  const imports = modules.map(
    ({ importPath }, index) =>
      `import * as moduleExports${index} from ${JSON.stringify(importPath)};`,
  );
  const moduleExports = modules.map(
    (_, index) => `...Object.values(moduleExports${index})`,
  );

  return `// Generated by voyzu compose. Do not edit.
import type { VoyzuApiModule } from "@voyzu/api";

${imports.join("\n")}

const discoveredModuleExports: unknown[] = [
  ${moduleExports.join(",\n  ")}
];

function isVoyzuApiModule(value: unknown): value is VoyzuApiModule {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<VoyzuApiModule>;
  return (
    typeof candidate.id === "string"
    && typeof candidate.name === "string"
    && !!candidate.apiDefinitions
    && typeof candidate.apiDefinitions === "object"
  );
}

export const composedApiModules: VoyzuApiModule[] =
  discoveredModuleExports.filter(isVoyzuApiModule);
`;
}

async function writeGeneratedComposition(packages) {
  await mkdir(generatedRoot, { recursive: true });
  await writeFile(
    join(generatedRoot, "voyzu-packages.generated.ts"),
    generatedRegistry(packages),
    "utf8",
  );
  await mkdir(apiGeneratedRoot, { recursive: true });
  await writeFile(
    join(apiGeneratedRoot, "voyzu-packages.generated.ts"),
    generatedApiRegistry(packages),
    "utf8",
  );
}

function run(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      ...options,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }
      reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function main() {
  if (!(await pathExists(join(runtimeRoot, "package.json")))) {
    throw new Error(
      "Voyzu development runtime not found. Run npm run create-dev first.",
    );
  }

  console.log("Discovering Voyzu packages...");
  const packages = await discoverPackages();

  await updateWorkspaceMetadata(packages);
  await updateNextConfig(packages);
  await updateTypeScriptConfig();
  await writeGeneratedComposition(packages);

  console.log("Installing composed workspace dependencies...");
  await run("npm", ["install"], { cwd: runtimeRoot });

  console.log("Installing Voyzu Modules development workspace dependencies...");
  await run("npm", ["install"], { cwd: modulesRoot });

  console.log("");
  console.log(
    `Voyzu composition complete: ${packages.length} package${packages.length === 1 ? "" : "s"}.`,
  );
}

main().catch((error) => {
  console.error("");
  console.error(`Compose failed: ${error.message}`);
  process.exitCode = 1;
});
