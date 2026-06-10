from auth.core.management.commands.build import build
from auth.core.management.commands.loaddata import loaddata
from auth.core.management.commands.runserver import runserver
from auth.core.management.commands.shell import shell

commands = [build, loaddata, runserver, shell]

__all__ = ["commands"]
