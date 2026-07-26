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
const generatedRoot = join(surfaceRoot, "generated", "voyzu-modules");

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
        modules.push(moduleEntry.name);
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
    if (uiDomainFiles.length !== 1) {
      throw new Error(
        `${manifest.name} must contain exactly one *.ui-domain.ts file.`,
      );
    }

    const leftNavFiles = await findFiles(
      join(directory, "ui-domain"),
      ".left-nav.ts",
    );
    if (leftNavFiles.length !== 1) {
      throw new Error(
        `${manifest.name} must contain exactly one *.left-nav.ts file.`,
      );
    }

    if (!manifest.exports?.["./ui-domain"]) {
      throw new Error(`${manifest.name} must export ./ui-domain.`);
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
      `import uiDomain${index} from ${JSON.stringify(`${name}/ui-domain`)};`,
  );
  const domainNames = packages.map((_, index) => `uiDomain${index}`);

  return `// Generated by voyzu compose. Do not edit.
import type {
  VoyzuSurfaceNavGroup,
  VoyzuSurfaceRoute,
} from "@voyzu/ui-surface/types";

${imports.join("\n")}

export interface ComposedSurfaceDomain {
  id: string;
  label: string;
  defaultPath: string;
  routePaths: Array<{ id: string; path: string }>;
  leftNav: VoyzuSurfaceNavGroup[];
}

const uiDomains = [${domainNames.join(", ")}];

export const composedPageRoutes: VoyzuSurfaceRoute[] = uiDomains.flatMap(
  (domain) => [...domain.pageRoutes],
);

export const composedLeftNav: VoyzuSurfaceNavGroup[] = uiDomains.flatMap(
  (domain) => [...domain.leftNav],
);

export const composedSurfaceDomains: ComposedSurfaceDomain[] = uiDomains.map(
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

const composedTopNav = `"use client";

import { usePathname, useRouter } from "next/navigation";

import { useIsMobile } from "@voyzu/ui-layout";
import styles from "@voyzu/ui-surface/css-modules/surface.module.css";

import type { ComposedSurfaceDomain } from "./voyzu-modules.generated";

interface ComposedTopNavProps {
  domains: ComposedSurfaceDomain[];
}

function routeMatches(pathname: string, routePath: string) {
  const routeSegments = routePath.split("/");
  const pathSegments = pathname.split("/");
  if (routeSegments.length !== pathSegments.length) return false;

  return routeSegments.every(
    (segment, index) =>
      (segment.startsWith("[") && segment.endsWith("]"))
      || segment === pathSegments[index],
  );
}

export function ComposedTopNav({ domains }: ComposedTopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const activeDomain = domains.find((domain) =>
    domain.routePaths.some(({ path }) => routeMatches(pathname, path))
  );

  if (isMobile) {
    const domain = activeDomain ?? domains[0];
    if (!domain) return null;

    return (
      <button
        className={\`\${styles.topNavButton} \${styles.topNavButtonActive}\`}
        type="button"
        aria-label={domain.label}
        onClick={() => router.push(domain.defaultPath)}
      >
        {domain.label}
      </button>
    );
  }

  return (
    <>
      {domains.map((domain) => (
        <button
          key={domain.id}
          className={[
            styles.topNavButton,
            domain.id === activeDomain?.id
              ? styles.topNavButtonActive
              : styles.topNavButtonInactive,
          ].join(" ")}
          type="button"
          aria-label={\`Go to \${domain.label}\`}
          onClick={() => router.push(domain.defaultPath)}
        >
          {domain.label}
        </button>
      ))}
    </>
  );
}
`;

const composedLeftNav = `"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { LeftNav, MobileNavDrawer, type NavGroup } from "@voyzu/ui-components";
import { useIsTablet } from "@voyzu/ui-layout";
import styles from "@voyzu/ui-surface/css-modules/surface.module.css";

import { toNavItem } from "../../surface/common/nav";
import type { ComposedSurfaceDomain } from "./voyzu-modules.generated";

interface ComposedLeftNavProps {
  domains: ComposedSurfaceDomain[];
}

function routeMatches(pathname: string, routePath: string) {
  const routeSegments = routePath.split("/");
  const pathSegments = pathname.split("/");
  if (routeSegments.length !== pathSegments.length) return false;

  return routeSegments.every(
    (segment, index) =>
      (segment.startsWith("[") && segment.endsWith("]"))
      || segment === pathSegments[index],
  );
}

export function ComposedLeftNav({ domains }: ComposedLeftNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isTablet = useIsTablet();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const activeDomain = domains.find((domain) =>
    domain.routePaths.some(({ path }) => routeMatches(pathname, path))
  );

  if (!activeDomain) return null;

  const routePathById = new Map(
    activeDomain.routePaths.map(({ id, path }) => [id, path]),
  );
  const groups: NavGroup[] = activeDomain.leftNav.map((group) => ({
    label: group.label,
    items: group.items.map((item) => toNavItem(item, routePathById)),
  }));
  const handleNavigate = (path: string) => {
    if (!path.startsWith("#")) router.push(path);
  };

  return (
    <>
      <button
        className={styles.mobileNavButton}
        type="button"
        aria-label="Open navigation"
        onClick={() => setIsMobileDrawerOpen(true)}
      >
        <span className="material-symbols-outlined">menu</span>
      </button>
      <div className={styles.desktopLeftNav}>
        <LeftNav
          groups={groups}
          currentPath={pathname}
          onNavigate={handleNavigate}
          isCollapsed={isTablet || isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isCollapseLocked={isTablet}
        />
      </div>
      <MobileNavDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        domains={domains.map(({ label }) => label)}
        activeDomain={activeDomain.label}
        onSelectDomain={(label) => {
          const domain = domains.find((item) => item.label === label);
          if (domain) router.push(domain.defaultPath);
        }}
        navSections={groups.map((group) => ({
          sectionLabel: group.label,
          items: group.items,
        }))}
        currentPath={pathname}
        onNavigate={handleNavigate}
        showCompanySelector={false}
        logoSrc="/voyzu/voyzu_color_logo_transparent.png"
      />
    </>
  );
}
`;

const surfaceConfig = `// Generated in part by voyzu compose. Recreate .dev to restore the platform source.
import { createElement } from "react";
import type { VoyzuSurfaceConfig, VoyzuSurfaceRoute } from "@voyzu/ui-surface/types";

import { authPageRoutes } from "./modules-config/auth.ui.config";
import {
  settingsLeftNav,
  settingsPageRoutes,
} from "./modules-config/settings.ui.config";
import { helloWorldPageRoutes } from "./modules-config/hello-world.ui.config";
import {
  composedLeftNav,
  composedPageRoutes,
  composedSurfaceDomains,
} from "./generated/voyzu-modules/voyzu-modules.generated";
import { ComposedLeftNav } from "./generated/voyzu-modules/ComposedLeftNav";
import { ComposedTopNav } from "./generated/voyzu-modules/ComposedTopNav";
import { VoyzuBrand } from "./surface/top-nav/VoyzuBrand";
import { SettingsButton } from "./surface/top-nav/SettingsButton";
import { SessionUserMenu } from "./surface/top-nav/SessionUserMenu";

const pageRoutes: VoyzuSurfaceRoute[] = [
  ...authPageRoutes,
  ...helloWorldPageRoutes,
  ...composedPageRoutes,
  ...settingsPageRoutes,
];

export const voyzuSurfaceConfig = {
  slots: {
    "top.brand": createElement(VoyzuBrand),
    "top.primaryNav": createElement(ComposedTopNav, {
      domains: composedSurfaceDomains,
    }),
    "top.utility.settings": createElement(SettingsButton),
    "top.user": createElement(SessionUserMenu),
    "left.nav": createElement(ComposedLeftNav, {
      domains: composedSurfaceDomains,
    }),
  },

  pageRoutes,
  leftNav: [...composedLeftNav, ...settingsLeftNav],
} satisfies VoyzuSurfaceConfig;
`;

async function writeGeneratedComposition(packages) {
  await mkdir(generatedRoot, { recursive: true });
  await writeFile(
    join(generatedRoot, "voyzu-modules.generated.ts"),
    generatedRegistry(packages),
    "utf8",
  );
  await writeFile(
    join(generatedRoot, "ComposedTopNav.tsx"),
    composedTopNav,
    "utf8",
  );
  await writeFile(
    join(generatedRoot, "ComposedLeftNav.tsx"),
    composedLeftNav,
    "utf8",
  );
  await writeFile(
    join(surfaceRoot, "voyzu.surface.config.ts"),
    surfaceConfig,
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
