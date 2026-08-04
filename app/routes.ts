import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/redirect.tsx"),
  route("home", "routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  layout("components/layout.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    route("analytics", "routes/analytics.tsx"),
    route("profile", "routes/profile.tsx"),
  ]),
] satisfies RouteConfig;
