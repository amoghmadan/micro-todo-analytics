import sys
from operator import not_
from pathlib import Path

import click
from grpc_tools.protoc import _get_resource_file_name, main

from tracker.conf import settings


@click.command()
@click.option(
    "-o",
    "--out-dir",
    default="src",
    type=click.Path(),
    help="Output directory for protobuf.",
)
@click.pass_context
def build(ctx: click.Context, out_dir: str) -> None:
    """Build gRPC code from .proto files."""
    project_root: Path = settings.BASE_DIR.parent  # type: ignore[attr-defined]
    if Path.cwd() != project_root:
        raise click.ClickException(
            "Couldn't run the command. Are you sure you are at the project root?"
        )
    binary = "bin"
    proto_dir = project_root / "proto"
    default_package = proto_dir / __package__.split(".")[0]
    protoc = 0
    directories = (out_dir, binary)
    for directory in directories:
        parts: list[str] = [
            str(path.relative_to(project_root))
            for path in proto_dir.glob("**/*.proto")
            if (
                not_(str(path).startswith(str(default_package)))
                if directory == binary
                else str(path).startswith(str(default_package))
            )
        ]
        if not parts:
            continue
        if not Path(directory).exists():
            Path(directory).mkdir(exist_ok=True)
        protoc = main(
            [
                _get_resource_file_name("grpc_tools", "protoc.py"),
                f"-I./{proto_dir.name}",
                f"--python_out={directory}",
                f"--grpc_python_out={directory}",
                *parts,
                f"-I{_get_resource_file_name('grpc_tools', '_proto')}",
            ]
        )
        if protoc:
            sys.exit(protoc)
        for path in Path(directory).resolve().rglob("**/*/"):
            if path.is_dir():
                (path / "__init__.py").touch(exist_ok=True)
    sys.exit(protoc)
