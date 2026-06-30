from tracker.core.management.commands.build import build
from tracker.core.management.commands.runserver import runserver
from tracker.core.management.commands.shell import shell

commands = [build, runserver, shell]

__all__ = ["commands"]
