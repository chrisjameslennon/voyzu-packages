import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const runtime = resolve(root, ".run");
const args = [
  "--env-file=.env.local",
  "--import", pathToFileURL(resolve(runtime, "node_modules/tsx/dist/loader.mjs")).href,
  "--import", pathToFileURL(resolve(runtime, "voyzu/lib/runtime-tools/src/register-runner-loader.mjs")).href,
  "--import", pathToFileURL(resolve(runtime, "internal-api/index.ts")).href,
  "--test", "--test-concurrency=1",
  resolve(root, "packages/@voyzu/commercial/tests/internal-api.test.ts"),
  resolve(runtime, "voyzu/packages/@voyzu/shared-contracts/composition/finance.test.ts"),
  resolve(runtime, "voyzu/packages/@voyzu/organization/tests/contracts/organization-finance.integration.test.ts"),
];
const child = spawn(process.execPath, args, {
  cwd: root, env: { ...process.env, VOYZU_WORKSPACE_ROOT: runtime }, stdio: "inherit",
});
child.once("error", (error) => { console.error(error); process.exitCode = 1; });
child.once("exit", (code) => { process.exitCode = code ?? 1; });
