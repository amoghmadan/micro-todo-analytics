import click

from tracker.__version__ import __version__
from tracker.core.management.commands import commands


@click.group("execute_from_command_line")
@click.version_option(version=__version__, prog_name=__package__.split(".")[0])
@click.option("-v", "--verbose", is_flag=True, help="Enable verbose output.")
@click.pass_context
def execute_from_command_line(ctx: click.Context, verbose: bool) -> None:
    """Execute management commands from the command line."""
    ctx.ensure_object(dict)
    ctx.obj["version"] = __version__
    ctx.obj["verbose"] = verbose


for command in commands:
    execute_from_command_line.add_command(command)


__all__ = ["execute_from_command_line"]
