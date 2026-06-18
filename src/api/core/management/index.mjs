import commander from "#/api/core/management/commands/index.mjs";

export default function executeFromCommandLine() {
  commander.parse(process.argv);
}
