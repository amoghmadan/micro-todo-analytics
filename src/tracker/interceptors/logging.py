import logging
import traceback
from logging import config
from typing import Awaitable, Callable
from uuid import uuid4

from grpc import (
    HandlerCallDetails,
    RpcMethodHandler,
    StatusCode,
    unary_unary_rpc_method_handler,
)
from grpc.aio import ServerInterceptor

from tracker.conf import settings

config.dictConfig(settings.LOGGING)  # type: ignore[attr-defined]


class AsyncLoggingInterceptor(ServerInterceptor):
    """Interceptor: Async Logging"""

    async def intercept_service(
        self,
        continuation: Callable[[HandlerCallDetails], Awaitable[RpcMethodHandler]],
        handler_call_details: HandlerCallDetails,
    ) -> RpcMethodHandler | None:
        handler = await continuation(handler_call_details)
        if handler is None:
            return None

        if handler.unary_unary:

            async def logging_behavior(request, context):
                root = f"[gRPC] {uuid4()}"
                method = handler_call_details.method
                req_text = str(request).replace("\n", " ")
                logging.info(f"{root} Request to {method}: {req_text}")

                try:
                    response = await handler.unary_unary(request, context)
                    res_text = str(response).replace("\n", " ")
                    logging.info(f"{root} Response from {method}: {res_text}")
                    return response
                except Exception as e:
                    if context.code() is not None:
                        logging.info(
                            f"{root} Response from {method}: "
                            f"{context.code()} {context.details()}"
                        )
                        raise e
                    logging.error(f"{root} Error in {method}: {e}")
                    logging.debug(traceback.format_exc())
                    await context.abort(StatusCode.INTERNAL, "Internal Server Error")

            return unary_unary_rpc_method_handler(
                logging_behavior,
                request_deserializer=handler.request_deserializer,
                response_serializer=handler.response_serializer,
            )

        return handler
