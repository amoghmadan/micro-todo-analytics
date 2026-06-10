import { Command } from "commander";
import runserver from "#/task/core/management/commands/runserver.mjs";
import shell from "#/task/core/management/commands/shell.mjs";

const commander = new Command();
commander
  .command("runserver")
  .description("Runs the server")
  .option("-p --port <port>", "Port", "50051")
  .option("-H --host <host>", "Host", "0.0.0.0")
  .action((options) => runserver(options.host, Number(options.port)));

commander
  .command("build")
  .description("Build proto")
  .option("-o --outDir <outDir>", "Out Dir", "./src")
  .action((options) => build(options.outDir));

commander
  .command("shell")
  .description("Shell")
  .action((_) => shell());

export default commander;
