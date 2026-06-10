from sqlalchemy import BigInteger, Column
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase


class Model(AsyncAttrs, DeclarativeBase):
    """Base: Model"""

    __abstract__ = True

    id = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)

    @property
    def pk(self) -> None | int | str | tuple:
        pk_columns = [c.name for c in self.__table__.primary_key.columns]
        if len(pk_columns) == 1:
            return getattr(self, pk_columns[0], None)
        return tuple(getattr(self, col, None) for col in pk_columns)

    def __eq__(self, other) -> bool:
        return self.pk == other.pk

    def __repr__(self) -> str:
        return "<%s: %s>" % (self.__class__.__name__, self)

    def __str__(self) -> str:
        return "%s object (%s)" % (self.__class__.__name__, self.pk)
