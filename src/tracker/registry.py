from tracker.protobuf.v1 import analytics_pb2_grpc, health_pb2_grpc
from tracker.services import AnalyticsService, HealthService

register = {
    HealthService: health_pb2_grpc.add_HealthServiceServicer_to_server,
    AnalyticsService: analytics_pb2_grpc.add_AnalyticsServiceServicer_to_server,
}
