import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const runtimeRoot = resolve(root, ".run");
const requestedTests = process.argv
  .slice(2)
  .map((value) => value.toLowerCase());
const matchesRequest = (file, requested) => {
  const normalizedFile = file.replaceAll("\\", "/").toLowerCase();
  if (requested.startsWith("@")) {
    return normalizedFile.includes(`/packages/${requested}/tests/commands/`);
  }
  return normalizedFile.includes(requested);
};
const testFiles = readdirSync(resolve(root, "packages"), {
  recursive: true,
  withFileTypes: true,
})
  .filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith(".test.ts") &&
      entry.parentPath.replaceAll("\\", "/").includes("/tests/commands"),
  )
  .map((entry) => resolve(entry.parentPath, entry.name))
  .filter(
    (file) =>
      requestedTests.length === 0 ||
      requestedTests.some((requested) => matchesRequest(file, requested)),
  );

if (testFiles.length === 0) {
  console.error(`No command tests matched: ${requestedTests.join(", ")}`);
  process.exit(1);
}

const args = [
  "--env-file=.env.local",
  "--import",
  pathToFileURL(resolve(runtimeRoot, "node_modules/tsx/dist/loader.mjs")).href,
  "--import",
  pathToFileURL(
    resolve(
      runtimeRoot,
      "voyzu/lib/runtime-tools/src/register-runner-loader.mjs",
    ),
  ).href,
  "--import",
  pathToFileURL(
    resolve(
      runtimeRoot,
      "voyzu/apps/web/.generated/commands/pre-installed.ts",
    ),
  ).href,
  "--import",
  pathToFileURL(
    resolve(runtimeRoot, "voyzu/apps/web/.generated/commands/installed.ts"),
  ).href,
  "--test",
  "--test-concurrency=1",
  ...testFiles,
];

const child = spawn(process.execPath, args, {
  cwd: root,
  env: {
    ...process.env,
    VOYZU_WORKSPACE_ROOT: runtimeRoot,
  },
  stdio: "inherit",
});

child.once("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});

child.once("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
