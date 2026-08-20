import { spawn } from "node:child_process";
import { resolve } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const runtimeRoot = resolve(root, ".run");
const testFiles = [
  "packages/@voyzu/ice-creams/tests/operations/ice-creams/ice-creams.operations.test.ts",
  "packages/@voyzu/ice-creams/tests/operations/reports/reports.operations.test.ts",
  "packages/@voyzu/ugly-package/tests/operations/ugly/ugly.operations.test.ts",
];

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
