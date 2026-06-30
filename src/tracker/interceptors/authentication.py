from contextvars import ContextVar

from auth.protobuf.v1 import user_pb2, user_pb2_grpc
from grpc import StatusCode, insecure_channel, unary_unary_rpc_method_handler
from grpc._channel import _InactiveRpcError
from grpc.aio import ServerInterceptor

from tracker.conf import settings

current_user: ContextVar[user_pb2.ProfileResponse | None] = ContextVar(
    "current_user", default=None
)


class AsyncAuthInterceptor(ServerInterceptor):
    skip_auth_methods = ("/tracker.protobuf.v1.HealthService/Ping",)

    async def intercept_service(self, continuation, handler_call_details):
        if handler_call_details.method in self.skip_auth_methods:
            return await continuation(handler_call_details)

        handler = await continuation(handler_call_details)

        if handler is None:
            return None

        async def auth_wrapper(request, context):
            metadata = context.invocation_metadata()
            with insecure_channel(settings.SERVICES["grpc"]["auth"]) as channel:
                try:
                    stub = user_pb2_grpc.ProtectedUserServiceStub(channel)
                    user = stub.Profile(user_pb2.ProfileRequest(), metadata=metadata)
                except _InactiveRpcError as e:
                    await context.abort(StatusCode.UNAVAILABLE, e.details())
            if not user:
                await context.abort(StatusCode.UNAUTHENTICATED, "Invalid Token")

            current_user.set(user)
            response = await handler.unary_unary(request, context)
            return response

        return unary_unary_rpc_method_handler(
            auth_wrapper,
            request_deserializer=handler.request_deserializer,
            response_serializer=handler.response_serializer,
        )
