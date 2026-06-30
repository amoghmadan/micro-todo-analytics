from google.protobuf.timestamp import Timestamp
from grpc import StatusCode

from tracker.interceptors.authentication import current_user
from tracker.repositories import AnalyticsRepository


class AnalyticsProcessor:
    """Processor: Analytics"""

    repository = AnalyticsRepository()

    async def day_analytics(self, request, context):
        user = current_user.get("user")
        if not request.HasField("date"):
            await context.abort(StatusCode.INVALID_ARGUMENT, "Date is required.")
        dt = Timestamp.ToDatetime(request.date).date()
        data = await self.repository.day_analytics(user.id, dt)
        return data

    async def week_analytics(self, request, context):
        user = current_user.get("user")
        if not request.HasField("date"):
            await context.abort(StatusCode.INVALID_ARGUMENT, "Date is required.")
        dt = Timestamp.ToDatetime(request.date).date()
        data = await self.repository.week_analytics(user.id, dt)
        return data

    async def month_analytics(self, request, context):
        user = current_user.get("user")
        if not request.HasField("date"):
            await context.abort(StatusCode.INVALID_ARGUMENT, "Date is required.")
        dt = Timestamp.ToDatetime(request.date).date()
        data = await self.repository.month_analytics(user.id, dt)
        return data

    async def year_analytics(self, request, context):
        user = current_user.get("user")
        if not request.HasField("date"):
            await context.abort(StatusCode.INVALID_ARGUMENT, "Date is required.")
        dt = Timestamp.ToDatetime(request.date).date()
        data = await self.repository.year_analytics(user.id, dt)
        return data
