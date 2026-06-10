import os
import subprocess  # nosec: B404
import sys

import click


@click.command()
@click.pass_context
def shell(ctx: click.Context) -> None:
    """Python shell with application context."""
    args = (sys.executable, "-i")
    subprocess.call(args, env=os.environ, shell=False)  # nosec: B603
