export default {
  HOST: "0.0.0.0",
  PORT: 8080,
  DEBUG: false,
  TIME_ZONE: "UTC",
  USE_TZ: true,
  GATEWAYS: {
    api: {
      url: "http://localhost:4000",
    },
  },
  SESSION: {
    secret: "",
    cookie: {
      name: "web_gateway_session",
      maxAge: 7 * 24 * 60 * 60,
      secure: undefined,
    },
  },
};
