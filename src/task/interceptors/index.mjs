import authInterceptor from "#/task/interceptors/auth.mjs";
import loggingInterceptor from "#/task/interceptors/logging.mjs";

export default [loggingInterceptor, authInterceptor];
