import { Command } from "commander";
import runserver from "#/task/core/management/commands/runserver.mjs";
import shell from "#/task/core/management/commands/shell.mjs";

const commander = new Command();
commander
  .command("runserver")
  .description("Runs the server")
  .option("-p --port <port>", "Port", "50051")
  .option("-H --host <host>", "Host", "::")
  .action((options) => runserver(options.host, Number(options.port)));

commander
  .command("shell")
  .description("Shell")
  .option("-p --print <print>", "Print")
  .option("-e --eval <eval>", "Eval")
  .action((options) => shell(options));

export default commander;
