from grpc import StatusCode
from sqlalchemy import inspect

from auth.models import User
from auth.repositories import UserRepository


class UserProcessor:
    """Processor: User"""

    repository = UserRepository()

    async def register(self, request, context) -> User:
        if request.password != request.confirm_password:
            msg = "Both the passwords should match."
            await context.abort(StatusCode.INVALID_ARGUMENT, msg)
        payload = {
            "first_name": request.first_name,
            "last_name": request.last_name,
            "email": request.email,
            "password": request.password,
        }
        user: User | None = await self.repository.register(payload)
        if not user:
            msg = "Email is already registered."
            await context.abort(StatusCode.INVALID_ARGUMENT, msg)
        obj = {
            c.key: getattr(user, c.key)
            for c in inspect(user).mapper.column_attrs
            if c.key not in ("id", "password")
        }
        return obj

    async def login(self, request, context) -> str:
        payload = {"email": request.email, "password": request.password}
        try:
            token: str = await self.repository.login(payload)
        except ValueError as e:
            await context.abort(StatusCode.INVALID_ARGUMENT, e.args[0])
        return {"token": token}

    async def logout(self, request, context, user) -> None:
        await self.repository.logout(user.id)

    async def profile(self, request, context, user: User) -> dict[str, str]:
        obj = {
            c.key: getattr(user, c.key)
            for c in inspect(user).mapper.column_attrs
            if c.key not in ("password",)
        }
        return obj

    async def password_change(self, request, context, user) -> None:
        if request.new_password != request.confirm_password:
            msg = "Both the passwords should match."
            await context.abort(StatusCode.INVALID_ARGUMENT, msg)
        payload = {
            "id": user.id,
            "current_password": request.current_password,
            "new_password": request.new_password,
        }
        try:
            await self.repository.password_change(payload)
        except ValueError as e:
            await context.abort(StatusCode.INVALID_ARGUMENT, e.args[0])
