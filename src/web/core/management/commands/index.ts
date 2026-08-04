import { Command } from "commander";

import runserver from "#/web/core/management/commands/runserver.ts";
import shell from "#/web/core/management/commands/shell.ts";

const commander = new Command();
commander
  .command("runserver")
  .description("Runs the server")
  .option("-p --port <port>", "Port", "8080")
  .option("-H --host <host>", "Host", "0.0.0.0")
  .action((options) => runserver(options.host, Number(options.port)));

commander
  .command("shell")
  .description("Shell")
  .option("-p --print <print>", "Print")
  .option("-e --eval <eval>", "Eval")
  .action((options) => shell(options));

export default commander;
