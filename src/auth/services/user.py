from auth.interceptors.authentication import current_user
from auth.protobuf.v1 import user_pb2, user_pb2_grpc
from auth.processors import UserProcessor


class PublicUserService(user_pb2_grpc.PublicUserServiceServicer):
    """Service: Public User Proto"""

    processor = UserProcessor()

    async def Register(self, request, context):
        obj = await self.processor.register(request, context)
        return user_pb2.RegisterResponse(**obj)

    async def Login(self, request, context):
        obj = await self.processor.login(request, context)
        return user_pb2.LoginResponse(**obj)


class ProtectedUserService(user_pb2_grpc.ProtectedUserServiceServicer):
    """Service: Private User Proto"""

    processor = UserProcessor()

    async def Profile(self, request, context):
        obj = await self.processor.profile(request, context, current_user.get())
        return user_pb2.ProfileResponse(**obj)

    async def Logout(self, request, context):
        await self.processor.logout(request, context, current_user.get())
        return user_pb2.LogoutResponse()

    async def PasswordChange(self, request, context):
        await self.processor.password_change(request, context, current_user.get())
        return user_pb2.PasswordChangeResponse()
