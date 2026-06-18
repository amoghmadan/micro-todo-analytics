import os
import subprocess  # nosec: B404
import sys

import click


@click.command()
@click.option(
    "-c",
    "--cmd",
    is_flag=False,
    default=None,
    help="program passed in as string (terminates option list)",
)
@click.pass_context
def shell(ctx: click.Context, command: str | None) -> None:
    """Python shell with application context."""
    params = ["-c", command] if command else ["-i"]
    cmd = [sys.executable] + params
    subprocess.call(cmd, env=os.environ, shell=False)  # nosec: B603
