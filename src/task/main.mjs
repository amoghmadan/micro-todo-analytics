async function main() {
  process.env.GRPC_SETTINGS_MODULE =
    process.env.GRPC_SETTINGS_MODULE || "#/task/settings.mjs";
  const executeFromCommandLine = (await import("#/task/core/management/index.mjs")).default;

  executeFromCommandLine();
}

if (import.meta.main) {
  await main();
}
