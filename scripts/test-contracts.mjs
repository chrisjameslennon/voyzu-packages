import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const runtime = resolve(root, ".run");
const args = [
  "--env-file=.env.local",
  "--import", pathToFileURL(resolve(runtime, "node_modules/tsx/dist/loader.mjs")).href,
  "--import", pathToFileURL(resolve(runtime, "voyzu/lib/runtime-tools/src/register-runner-loader.mjs")).href,
  "--import", pathToFileURL(resolve(runtime, "contracts/index.ts")).href,
  "--test", "--test-concurrency=1",
  resolve(runtime, "voyzu/lib/capability/src/contracts/contracts.test.ts"),
  resolve(runtime, "packages/@voyzu/erp-core/tests/contracts/organization-finance.integration.test.ts"),
];
const child = spawn(process.execPath, args, {
  cwd: root, env: { ...process.env, VOYZU_WORKSPACE_ROOT: runtime }, stdio: "inherit",
});
child.once("error", (error) => { console.error(error); process.exitCode = 1; });
child.once("exit", (code) => { process.exitCode = code ?? 1; });
