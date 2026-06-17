import asyncio
import sys
from concurrent import futures

from grpc.aio import Server, server

from auth.interceptors import interceptors
from auth.registry import register


class GRPCHandler:
    """Handler: gRPC"""

    migration_thread_pool = futures.ThreadPoolExecutor(max_workers=10)

    def handle(self, host: str = "::", port: int = 50051):
        async def _main() -> None:
            bind = f"{f"[{host}]" if ":" in host else host}:{port}"
            application: Server = server(
                self.migration_thread_pool, interceptors=interceptors
            )
            application.add_insecure_port(bind)
            for service, servicer in register.items():
                servicer(service(), application)
            try:
                await application.start()
                sys.stdout.write(f"Starting server at grpc://{bind}\n")
                await application.wait_for_termination()
            except asyncio.CancelledError:
                sys.stdout.write("\nStopping server...\n")
                await application.stop(5)

        try:
            asyncio.run(_main())
        except KeyboardInterrupt:
            sys.stdout.write("Server stop complete.\n")
