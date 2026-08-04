import { DateTime, FixedOffsetZone } from "luxon";
import settings from "../conf/index.ts";

function now() {
  if (settings.USE_TZ) {
    return DateTime.utc();
  }
  return DateTime.local();
}

function getFixedTimezone(offset: number) {
  // offset in minutes
  if (typeof offset !== "number") {
    throw new Error("Offset must be in minutes");
  }

  return FixedOffsetZone.instance(offset);
}

let _cachedZone: string | null = null;

function getDefaultTimezone() {
  if (!_cachedZone) {
    _cachedZone = settings.TIME_ZONE;
  }
  return _cachedZone;
}

export default {
  now,
  getFixedTimezone,
  getDefaultTimezone,
};
