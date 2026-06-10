from auth.protobuf.v1 import health_pb2_grpc, user_pb2_grpc
from auth.services import HealthService, ProtectedUserService, PublicUserService

register = {
    HealthService: health_pb2_grpc.add_HealthServiceServicer_to_server,
    ProtectedUserService: user_pb2_grpc.add_ProtectedUserServiceServicer_to_server,
    PublicUserService: user_pb2_grpc.add_PublicUserServiceServicer_to_server,
}
