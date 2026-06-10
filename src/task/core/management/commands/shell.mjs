import { spawnSync } from "child_process";

export default function shell() {
  spawnSync(process.execPath, { stdio: "inherit", env: process.env });
}
