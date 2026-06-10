from grpc.aio import ServerInterceptor

from auth.interceptors.authentication import AsyncAuthInterceptor
from auth.interceptors.logging import AsyncLoggingInterceptor

interceptors: list[ServerInterceptor] = [
    AsyncAuthInterceptor(),
    AsyncLoggingInterceptor(),
]

__all__ = ["interceptors"]
