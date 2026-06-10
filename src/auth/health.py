from tracker.core.exceptions import Error
from tracker.processors import HealthProcessor
from tracker.protobuf.v1 import health_pb2, health_pb2_grpc


class HealthService(health_pb2_grpc.HealthServiceServicer):
    """Servicer: Health Check Service"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.processor = HealthProcessor()

    async def Ping(self, request, context):
        """Ping SQL"""
        if request.throw:
            msg = "This is a test for error."
            raise Error(msg)
        reply: str = await self.processor.ping()  # type: ignore[annotation-unchecked]
        return health_pb2.PingResponse(reply=reply)
