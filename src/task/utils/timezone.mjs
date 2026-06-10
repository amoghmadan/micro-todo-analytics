import { DateTime, FixedOffsetZone } from "luxon";
import settings from "#/task/conf/settings";

function now() {
  if (settings.USE_TZ) {
    return DateTime.utc();
  }
  return DateTime.local();
}

function getFixedTimezone(offset) {
  // offset in minutes
  if (typeof offset !== "number") {
    throw new Error("Offset must be in minutes");
  }

  return FixedOffsetZone.instance(offset);
}

let _cachedZone = null;

function getDefaultTimezone() {
  if (!_cachedZone) {
    _cachedZone = settings.TIME_ZONE;
  }
  return _cachedZone;
}

module.exports = {
  now,
  getFixedTimezone,
  getDefaultTimezone,
};
