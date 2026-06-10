from sqlalchemy import select
from sqlalchemy.orm import selectinload

from auth.db import session
from auth.models import Token, User
from auth.utils import timezone


class UserRepository:
    """Repository: User"""

    model = User

    async def from_token(self, token: str) -> User | None:
        statement = (
            select(Token).options(selectinload(Token.user)).where(Token.key == token)
        )
        async with session() as db:
            result = await db.execute(statement)
            token: Token = result.scalar()
            if not token:
                return None
            return token.user

    async def register(self, data: dict[str, str]) -> User:
        password = data.pop("password")
        user = User(**data)
        user.set_password(password)
        async with session() as db:
            db.add(user)
            await db.commit()
            await db.refresh(user)
        return user

    async def login(self, data: dict[str, str]) -> Token:
        statement = (
            select(User)
            .options(selectinload(User.token))
            .where(User.email == data["email"])
        )
        async with session() as db:
            result = await db.execute(statement)
            user: User = result.scalar()
            if not user.check_password(data["password"]):
                raise ValueError("Email or password incorrect.")
            token: Token = user.token
            if token:
                await db.delete(token)
                await db.commit()
            user.last_login = timezone.now()
            token = Token(user_id=user.pk)
            db.add(token)
            await db.commit()
            await db.refresh(token)
        return token

    async def logout(self, user_id: int) -> None:
        statement = select(Token).where(Token.user_id == user_id)
        async with session() as db:
            result = await db.execute(statement)
            token_obj = result.scalar()
            await db.delete(token_obj)
            await db.commit()

    async def password_change(self, data: dict[str, str]) -> None:
        statement = select(User).where(User.id == data["id"])
        async with session() as db:
            result = await db.execute(statement)
            user: User = result.scalar()
            if not user.check_password(data["current_password"]):
                raise ValueError("Invalid current password.")
            user.set_password(data["new_password"])
            db.add(user)
            await db.commit()
