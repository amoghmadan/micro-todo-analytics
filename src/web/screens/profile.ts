import {
  AbstractComponent,
  CardComponent,
  FormComponent,
  InputComponent,
  RowComponent,
  ScreenComponent,
  TextComponent,
} from "../lib/sdui/index.ts";
import type { SduiScreen } from "../lib/sdui/index.ts";
import { GatewayError, getProfile } from "../lib/gateway.ts";
import type { ScreenContext } from "./index.ts";

export class ProfileScreen extends AbstractComponent<Promise<SduiScreen>> {
  constructor(private readonly ctx: ScreenContext) {
    super();
  }

  async render(): Promise<SduiScreen> {
    const session = this.ctx.session;
    if (!session) throw new GatewayError("Unauthenticated", 401);

    const user = await getProfile(session.token);

    return new ScreenComponent(
      "profile",
      [
        new TextComponent("Profile", "h2"),
        new CardComponent([
          new RowComponent([new TextComponent("Name", "muted"), new TextComponent(`${user.firstName} ${user.lastName}`)]),
          new RowComponent([new TextComponent("Email", "muted"), new TextComponent(user.email)]),
          new RowComponent([new TextComponent("Joined", "muted"), new TextComponent(new Date(user.dateJoined).toLocaleDateString())]),
          new RowComponent([
            new TextComponent("Last login", "muted"),
            new TextComponent(user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"),
          ]),
        ]),
        new TextComponent("Change Password", "h3"),
        new FormComponent(
          "change-password",
          [
            new InputComponent("currentPassword", { label: "Current password", type: "password", required: true }),
            new InputComponent("newPassword", { label: "New password", type: "password", required: true, minLength: 8 }),
            new InputComponent("confirmPassword", { label: "Confirm new password", type: "password", required: true, minLength: 8 }),
          ],
          { submitLabel: "Change password" }
        ),
      ],
      { title: "Profile" }
    ).render();
  }
}
