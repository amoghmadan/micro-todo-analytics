def get_grpc_application():
    from auth.core.handlers.grpc import GRPCHandler

    return GRPCHandler()
