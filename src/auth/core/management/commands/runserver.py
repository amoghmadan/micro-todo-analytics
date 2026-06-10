import click

from auth.core.grpc import get_grpc_application


@click.command()
@click.option("-h", "--host", default="::", type=click.STRING, help="Host")
@click.option("-p", "--port", default=50051, type=click.INT, help="Port")
@click.pass_context
def runserver(ctx: click.Context, host: str, port: int) -> None:
    """Serve gRPC application."""
    application = get_grpc_application()
    application.handle(host, port)
