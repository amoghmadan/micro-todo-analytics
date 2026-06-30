from sqlalchemy import Result, TextClause, text

from tracker.__version__ import __version__
from tracker.db import session


class HealthRepository:
    """
    Repository for database-level healthcheck operations.
    """

    query: TextClause = text("SELECT :version AS reply;")

    async def get_ping_text(self) -> str:
        """
        Executes a simple DB query to confirm connectivity.
        :return: str
        """
        async with session() as db:
            result: Result = await db.execute(self.query, {"version": __version__})
            return result.scalar_one()
