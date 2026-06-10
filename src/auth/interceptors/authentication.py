from contextvars import ContextVar

from grpc import StatusCode, unary_unary_rpc_method_handler
from grpc.aio import ServerInterceptor

from auth.models import User
from auth.repositories import UserRepository

current_user: ContextVar[User | None] = ContextVar("current_user", default=None)


class AsyncAuthInterceptor(ServerInterceptor):
    repository = UserRepository()
    skip_auth_methods = (
        "/auth.protobuf.v1.HealthService/Ping",
        "/auth.protobuf.v1.PublicUserService/Register",
        "/auth.protobuf.v1.PublicUserService/Login",
    )

    async def intercept_service(self, continuation, handler_call_details):
        if handler_call_details.method in self.skip_auth_methods:
            return await continuation(handler_call_details)

        handler = await continuation(handler_call_details)

        if handler is None:
            return None

        async def auth_wrapper(request, context):
            metadata = dict(context.invocation_metadata())
            authorization = metadata.get("authorization")

            if not authorization or not authorization.startswith("Bearer "):
                await context.abort(StatusCode.UNAUTHENTICATED, "Invalid Token")

            token = authorization.removeprefix("Bearer ")
            user: User = await self.repository.from_token(token)
            if not user:
                await context.abort(StatusCode.UNAUTHENTICATED, "Invalid Token")

            current_user.set(user)
            return await handler.unary_unary(request, context)

        return unary_unary_rpc_method_handler(
            auth_wrapper,
            request_deserializer=handler.request_deserializer,
            response_serializer=handler.response_serializer,
        )
