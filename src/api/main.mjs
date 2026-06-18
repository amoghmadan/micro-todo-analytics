async function main() {
  process.env.EXPRESS_SETTINGS_MODULE =
    process.env.EXPRESS_SETTINGS_MODULE || "#/api/settings.mjs";
  const executeFromCommandLine = (await import("#/api/core/management/index.mjs")).default;

  executeFromCommandLine();
}

if (import.meta.main) {
  await main();
}
