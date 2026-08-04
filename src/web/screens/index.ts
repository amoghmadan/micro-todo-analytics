import type { AppContext } from "../types.ts";
import type { SessionPayload } from "../lib/session.ts";
import type { AbstractComponent, SduiScreen } from "../lib/sdui/index.ts";
import { AnalyticsScreen } from "./analytics.ts";
import { DashboardScreen } from "./dashboard.ts";
import { LoginScreen } from "./login.ts";
import { ProfileScreen } from "./profile.ts";
import { RegisterScreen } from "./register.ts";

export interface ScreenContext {
  c: AppContext;
  session: SessionPayload | null;
  query: Record<string, string | undefined>;
}

export type ScreenClass = new (ctx: ScreenContext) => AbstractComponent<Promise<SduiScreen>>;

export const screenRegistry: Record<string, ScreenClass> = {
  login: LoginScreen,
  register: RegisterScreen,
  dashboard: DashboardScreen,
  analytics: AnalyticsScreen,
  profile: ProfileScreen,
};
