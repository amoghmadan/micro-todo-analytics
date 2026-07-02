import os
import sys
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
    
    proto_dir = project_root / "proto"
    parts: list[str] = [
        str(path.relative_to(project_root))
        for path in proto_dir.glob("**/*.proto")
    ]

    out_path = Path(out_dir)
    out_path.mkdir(exist_ok=True)
    protoc = main(
        [
            _get_resource_file_name("grpc_tools", "protoc.py"),
            f"-I./{proto_dir.name}",
            f"--python_out={out_dir}",
            f"--grpc_python_out={out_dir}",
            *parts,
            f"-I{_get_resource_file_name('grpc_tools', '_proto')}",
        ]
    )

    if protoc:
        sys.exit(protoc)

    package_dir = f"{out_dir}{os.path.sep}{__package__.split(".")[0]}"
    for path in out_path.rglob("**/*/"):
        if path.is_dir() and str(path).startswith(package_dir):
            (path / "__init__.py").touch(exist_ok=True)

    sys.exit(0)
