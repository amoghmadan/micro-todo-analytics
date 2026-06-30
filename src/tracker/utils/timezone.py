from datetime import datetime, timedelta, timezone
from functools import lru_cache
from zoneinfo import ZoneInfo

from tracker.conf import settings


def now() -> datetime:
    """
    Timezone based datetime.now.
    return: datetime
    """
    return datetime.now(
        tz=timezone.utc if settings.USE_TZ else None  # type: ignore[attr-defined]
    )


def get_fixed_timezone(offset) -> timezone:
    """Return a tzinfo instance with a fixed offset from UTC."""
    if isinstance(offset, timedelta):
        offset = offset.total_seconds() // 60
    sign = "-" if offset < 0 else "+"
    hhmm = "%02d%02d" % divmod(abs(offset), 60)
    name = sign + hhmm
    return timezone(timedelta(minutes=offset), name)


@lru_cache
def get_default_timezone() -> ZoneInfo:
    """
    Return the default time zone as a tzinfo instance.

    This is the time zone defined by settings.TIME_ZONE.
    """
    return ZoneInfo(settings.TIME_ZONE)  # type: ignore[attr-defined]


__all__ = ["now", "timedelta", "get_default_timezone", "get_fixed_timezone"]
