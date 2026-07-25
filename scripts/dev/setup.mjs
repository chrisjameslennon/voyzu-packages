import { access, copyFile, mkdir, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const appsRoot = resolve(repositoryRoot, "apps");
const applicationRoot = resolve(appsRoot, "web");
const platformRoot = resolve(repositoryRoot, "../voyzu");
const generator = resolve(
  repositoryRoot,
  "../create-voyzu/create-voyzu/bin/create-voyzu.js",
);

function assertInside(parent, child) {
  if (!child.startsWith(parent + sep)) {
    throw new Error(`Path escapes expected parent: ${child}`);
  }
}

function run(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
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

async function readGitOutput(args) {
  let output = "";

  await new Promise((resolvePromise, reject) => {
    const child = spawn(
      "git",
      args,
      { cwd: platformRoot },
    );

    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }

      reject(new Error(`git exited with code ${code}`));
    });
  });

  return output.trim();
}

async function readPlatformBranch() {
  const branch = await readGitOutput(["branch", "--show-current"]);
  if (!branch) {
    throw new Error("Could not determine the sibling Voyzu branch.");
  }

  return branch;
}

async function readApplicationTemplateRef() {
  const extractionCommit = await readGitOutput([
    "log",
    "-1",
    "--diff-filter=D",
    "--format=%H",
    "--",
    "apps/web/app/(web)/modules-config/finance.ui.config.ts",
  ]);

  return extractionCommit
    ? await readGitOutput(["rev-parse", `${extractionCommit}^`])
    : "HEAD";
}

async function copyLocalEnvironment() {
  const source = resolve(platformRoot, "apps/web/.env.local");
  const target = resolve(applicationRoot, "apps/web/.env.local");

  try {
    await access(source);
  } catch {
    return;
  }

  await copyFile(source, target);
}

async function main() {
  assertInside(repositoryRoot, appsRoot);
  assertInside(appsRoot, applicationRoot);
  await access(generator);
  const platformBranch = await readPlatformBranch();
  const applicationTemplateRef = await readApplicationTemplateRef();

  console.log("Recreating disposable Voyzu development application...");
  await rm(appsRoot, { recursive: true, force: true });
  await mkdir(appsRoot, { recursive: true });

  await run(process.execPath, [generator, applicationRoot], {
    cwd: repositoryRoot,
    env: {
      ...process.env,
      VOYZU_REF: platformBranch,
      VOYZU_SOURCE_DIR: platformRoot,
      VOYZU_SOURCE_REF: applicationTemplateRef,
    },
  });

  await rm(resolve(applicationRoot, ".git"), {
    recursive: true,
    force: true,
  });
  await copyLocalEnvironment();

  console.log("");
  console.log("Development application created at apps/web.");
  console.log("Run npm run compose before starting it.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
