import { spawnSync } from "node:child_process";

export default function shell(options: { print?: string; eval?: string }) {
  const args: string[] = [];

  if (options.print) args.push("-p", options.print);
  if (options.eval) args.push("-e", options.eval);

  const result = spawnSync(process.execPath, args.length ? args : ["-i"], {
    stdio: "inherit",
    env: process.env,
  });
  process.exit(result.status ?? 0);
}
