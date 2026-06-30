from tracker.processors import AnalyticsProcessor
from tracker.protobuf.v1 import analytics_pb2, analytics_pb2_grpc


class AnalyticsService(analytics_pb2_grpc.AnalyticsServiceServicer):
    """Servicer: Analytics"""

    processor = AnalyticsProcessor()

    async def DayAnalytics(self, request, context):
        data = await self.processor.day_analytics(request, context)
        hourly = [
            analytics_pb2.DayAnalyticsResponse.Hourly(
                hour=i.hour,
                counts=analytics_pb2.Count(
                    todo=i.todo,
                    in_progress=i.in_progress,
                    done=i.done,
                    scraped=i.scraped,
                    total=i.total,
                ),
            )
            for i in data
        ]
        return analytics_pb2.DayAnalyticsResponse(results=hourly)

    async def WeekAnalytics(self, request, context):
        data = await self.processor.week_analytics(request, context)
        daily = [
            analytics_pb2.WeekAnalyticsResponse.Daily(
                weekday=i.day,
                counts=analytics_pb2.Count(
                    todo=i.todo,
                    in_progress=i.in_progress,
                    done=i.done,
                    scraped=i.scraped,
                    total=i.total,
                ),
            )
            for i in data
        ]
        return analytics_pb2.WeekAnalyticsResponse(results=daily)

    async def MonthAnalytics(self, request, context):
        data = await self.processor.month_analytics(request, context)
        daily = [
            analytics_pb2.MonthAnalyticsResponse.Weekly(
                week=i.week,
                counts=analytics_pb2.Count(
                    todo=i.todo,
                    in_progress=i.in_progress,
                    done=i.done,
                    scraped=i.scraped,
                    total=i.total,
                ),
            )
            for i in data
        ]
        return analytics_pb2.MonthAnalyticsResponse(results=daily)

    async def YearAnalytics(self, request, context):
        data = await self.processor.year_analytics(request, context)
        daily = [
            analytics_pb2.YearAnalyticsResponse.Monthly(
                month=i.month,
                counts=analytics_pb2.Count(
                    todo=i.todo,
                    in_progress=i.in_progress,
                    done=i.done,
                    scraped=i.scraped,
                    total=i.total,
                ),
            )
            for i in data
        ]
        return analytics_pb2.YearAnalyticsResponse(results=daily)
