import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const runtimeRoot = resolve(root, ".run");
const testFiles = readdirSync(resolve(root, "packages"), { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile()
    && entry.name.endsWith(".test.ts")
    && entry.parentPath.replaceAll("\\", "/").includes("/tests/operations/"))
  .map((entry) => resolve(entry.parentPath, entry.name));

const args = [
  "--env-file=.env.local",
  "--import",
  pathToFileURL(resolve(runtimeRoot, "node_modules/tsx/dist/loader.mjs")).href,
  "--import",
  pathToFileURL(resolve(runtimeRoot, "voyzu/lib/runtime-tools/src/register-runner-loader.mjs")).href,
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
