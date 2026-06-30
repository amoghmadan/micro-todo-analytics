from datetime import date, datetime, time, timedelta

from dateutil.relativedelta import relativedelta
from sqlalchemy import func, select, text

from tracker.db import session
from tracker.models import ItemAudit


class AnalyticsRepository:
    model = ItemAudit

    def _status_counts(self):
        return [
            func.count().filter(self.model.status == 0).label("todo"),
            func.count().filter(self.model.status == 1).label("in_progress"),
            func.count().filter(self.model.status == 2).label("done"),
            func.count().filter(self.model.status == 3).label("scraped"),
            func.count(self.model.id).label("total"),
        ]

    async def day_analytics(self, user_id: int, dt: date):
        start = datetime.combine(dt, time.min)
        end = start + timedelta(days=1)

        series = select(
            func.generate_series(
                start,
                end - timedelta(hours=1),
                timedelta(hours=1),
            ).label("bucket")
        ).subquery()

        bucket = series.c.bucket

        statement = (
            select(
                func.to_char(bucket, "DD-MM-YYYY HH24:MI").label("hour"),
                *self._status_counts(),
            )
            .select_from(series)
            .outerjoin(
                ItemAudit,
                (
                    (func.date_trunc("hour", ItemAudit.created_at) == bucket)
                    & (ItemAudit.user_id == user_id)
                    & (ItemAudit.is_deleted.is_(False))
                    & (ItemAudit.created_at >= start)
                    & (ItemAudit.created_at < end)
                ),
            )
            .group_by(bucket)
            .order_by(bucket)
        )

        async with session() as db:
            result = await db.execute(statement)
            return result.all()

    async def week_analytics(self, user_id: int, date_: date):
        start_dt = datetime.combine(date_, time.min)
        end_dt = start_dt + timedelta(days=7)

        # Generate one bucket for each day in the requested range.
        # If start=2026-06-29 and end=2026-07-06, this yields 7 buckets.
        series = select(
            func.generate_series(
                start_dt,
                end_dt - timedelta(days=1),
                timedelta(days=1),
            ).label("bucket")
        ).subquery()

        bucket = series.c.bucket

        statement = (
            select(
                func.to_char(bucket, "DD-MM-YYYY").label("day"),
                *self._status_counts(),
            )
            .select_from(series)
            .outerjoin(
                ItemAudit,
                (
                    (func.date_trunc("day", ItemAudit.created_at) == bucket)
                    & (ItemAudit.user_id == user_id)
                    & (ItemAudit.is_deleted.is_(False))
                    & (ItemAudit.created_at >= start_dt)
                    & (ItemAudit.created_at < end_dt)
                ),
            )
            .group_by(bucket)
            .order_by(bucket)
        )

        async with session() as db:
            result = await db.execute(statement)
            return result.all()

    async def month_analytics(self, user_id: int, date_: date):
        start_dt = datetime.combine(date_, time.min)
        end_dt = start_dt + relativedelta(months=1)

        series = select(
            func.generate_series(
                func.date_trunc("week", start_dt),
                func.date_trunc("week", end_dt - timedelta(days=1)),
                text("interval '1 week'"),
            ).label("bucket")
        ).subquery()

        bucket = series.c.bucket

        statement = (
            select(
                func.concat(
                    func.to_char(bucket, "DD-MM-YYYY"),
                    " - ",
                    func.to_char(
                        bucket + timedelta(days=6),
                        "DD-MM-YYYY",
                    ),
                ).label("week"),
                *self._status_counts(),
            )
            .select_from(series)
            .outerjoin(
                ItemAudit,
                (
                    (func.date_trunc("week", ItemAudit.created_at) == bucket)
                    & (ItemAudit.user_id == user_id)
                    & (ItemAudit.is_deleted.is_(False))
                    & (ItemAudit.created_at >= start_dt)
                    & (ItemAudit.created_at < end_dt)
                ),
            )
            .group_by(bucket)
            .order_by(bucket)
        )

        async with session() as db:
            result = await db.execute(statement)
            return result.all()

    async def year_analytics(self, user_id: int, date_: date):
        start_dt = datetime.combine(date_, time.min)
        end_dt = start_dt + relativedelta(years=1)

        series = select(
            func.generate_series(
                func.date_trunc("month", start_dt),
                func.date_trunc("month", end_dt - timedelta(days=1)),
                text("interval '1 month'"),
            ).label("bucket")
        ).subquery()

        bucket = series.c.bucket

        statement = (
            select(
                func.to_char(bucket, "Mon YYYY").label("month"),
                *self._status_counts(),
            )
            .select_from(series)
            .outerjoin(
                ItemAudit,
                (
                    (func.date_trunc("month", ItemAudit.created_at) == bucket)
                    & (ItemAudit.user_id == user_id)
                    & (ItemAudit.is_deleted.is_(False))
                    & (ItemAudit.created_at >= start_dt)
                    & (ItemAudit.created_at < end_dt)
                ),
            )
            .group_by(bucket)
            .order_by(bucket)
        )

        async with session() as db:
            result = await db.execute(statement)
            return result.all()
