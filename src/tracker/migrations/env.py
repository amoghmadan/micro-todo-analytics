import asyncio
import os
import sys
from logging.config import dictConfig
from typing import Any, Optional

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

os.environ.setdefault("GRPC_SETTINGS_MODULE", "tracker.settings")

from tracker.conf import settings  # noqa: E402
from tracker.db import DEFAULT_DB_ALIAS, models  # noqa: E402
from tracker.models import *  # noqa: E402,F401,F403

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config
config.set_main_option("sqlalchemy.url", settings.DATABASES[DEFAULT_DB_ALIAS]["url"])  # type: ignore[attr-defined]

# Interpret the config file for Python logging.
# This line sets up loggers basically.
alembic_logging = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "generic": {
            "format": "%(levelname)-5.5s [%(name)s] %(message)s",
            "datefmt": "%H:%M:%S",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "stream": sys.stderr,
            "level": "NOTSET",
            "formatter": "generic",
        },
    },
    "loggers": {
        "": {
            "level": "WARNING",
            "handlers": ["console"],
            "propagate": False,
        },
        "sqlalchemy.engine": {
            "level": "WARNING",
            "handlers": [],
            "propagate": False,
        },
        "alembic": {
            "level": "INFO",
            "handlers": [],
            "propagate": False,
        },
    },
}
dictConfig(alembic_logging)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = models.Model.metadata  # type: ignore[attr-defined]

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def include_object(
    obj: Any, name: str, type_: str, reflected: bool, compare_to: Optional[Any]
) -> bool:
    """Determine which objects to include in the migration"""
    if type_ == "table" and name.startswith("celery_"):
        return False
    return True


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_object=include_object,
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        include_object=include_object,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """In this scenario we need to create an Engine
    and associate a connection with the context.
    """

    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""

    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
