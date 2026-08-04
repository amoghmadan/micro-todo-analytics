async function main() {
  process.env.HONO_SETTINGS_MODULE =
    process.env.HONO_SETTINGS_MODULE || "#/web/settings.ts";
  const executeFromCommandLine = (
    await import("#/web/core/management/index.ts")
  ).default;

  executeFromCommandLine();
}

if (import.meta.main) {
  await main();
}
