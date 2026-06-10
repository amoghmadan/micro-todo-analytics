import asyncio
import importlib
import json
from typing import Any

import click
from sqlalchemy.exc import IntegrityError

from auth.conf import settings
from auth.db import session


async def _process(data: list[dict[str, Any]]) -> None:
    async with session() as db:
        for entry in data:
            try:
                model_name = entry.pop("model").split(".")[-1]
                model_module = importlib.import_module("auth.models")
                model_class = getattr(model_module, model_name)
                obj = model_class(id=entry["pk"], **entry["fields"])
                db.add(obj)
                await db.commit()
            except IntegrityError:
                await db.rollback()


@click.command()
@click.argument("files", nargs=-1, required=True, type=click.STRING)
@click.pass_context
def loaddata(ctx: click.Context, files: list[str]) -> None:
    """Load JSON data into tables."""
    fixtures_dir = settings.BASE_DIR.parent / "fixtures"  # type: ignore[attr-defined]
    for file in files:
        with open(fixtures_dir / file, "r") as fp:
            data = json.load(fp)
        asyncio.run(_process(data))
