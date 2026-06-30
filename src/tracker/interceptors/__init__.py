from grpc.aio import ServerInterceptor

from tracker.interceptors.authentication import AsyncAuthInterceptor
from tracker.interceptors.logging import AsyncLoggingInterceptor

interceptors: list[ServerInterceptor] = [
    AsyncAuthInterceptor(),
    AsyncLoggingInterceptor(),
]

__all__ = ["interceptors"]
