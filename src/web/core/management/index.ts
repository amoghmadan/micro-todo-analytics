import commander from "#/web/core/management/commands/index.ts";

export default function executeFromCommandLine() {
  commander.parse(process.argv);
}
