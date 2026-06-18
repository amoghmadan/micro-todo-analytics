import { spawnSync } from "child_process";

export default function shell(options) {
  const args = [];

  if (options.print) args.push("-p", options.print);
  if (options.eval) args.push("-e", options.eval);

  const result = spawnSync(process.execPath, args ? args : ["-i"], {
    stdio: "inherit",
    env: process.env,
  });
  process.exit(result.status ?? 0);
}
