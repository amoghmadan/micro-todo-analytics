import globalSettings from "./globalSettings.ts";

const ENVIRONMENT_VARIABLE = "HONO_SETTINGS_MODULE";
const DEFAULT_SETTINGS_MODULE = "#/web/settings.ts";

async function settingsFromModule(modulePath: string) {
  const mod = (await import(modulePath)) as Partial<typeof globalSettings>;
  return { ...globalSettings, ...mod };
}

const settingsModule = process.env[ENVIRONMENT_VARIABLE] || DEFAULT_SETTINGS_MODULE;
const settings = await settingsFromModule(settingsModule);

export default settings;
