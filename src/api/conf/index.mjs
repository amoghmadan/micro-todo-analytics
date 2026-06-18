import globalSettings from "#/api/conf/globalSettings.mjs";

const ENVIRONMENT_VARIABLE = "EXPRESS_SETTINGS_MODULE";

async function settingsFromModule(module) {
  const mod = await import(module);
  return { ...globalSettings, ...mod };
}

const settingsModule = process.env[ENVIRONMENT_VARIABLE];
const settings = await settingsFromModule(settingsModule);

export default settings;
