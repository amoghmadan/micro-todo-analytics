import {
  AbstractComponent,
  FormComponent,
  InputComponent,
  LinkComponent,
  RowComponent,
  ScreenComponent,
  TextComponent,
} from "../lib/sdui/index.ts";
import type { SduiScreen } from "../lib/sdui/index.ts";

export class LoginScreen extends AbstractComponent<Promise<SduiScreen>> {
  async render(): Promise<SduiScreen> {
    return new ScreenComponent(
      "login",
      [
        new TextComponent("Micro Todo Analytics", "title"),
        new TextComponent("Sign in to your account", "muted"),
        new FormComponent(
          "login",
          [
            new InputComponent("email", { label: "Email", type: "email", required: true }),
            new InputComponent("password", { label: "Password", type: "password", required: true }),
          ],
          { submitLabel: "Sign in" }
        ),
        new RowComponent([
          new TextComponent("Don't have an account? ", "muted"),
          new LinkComponent("/register", "Register", "primary"),
        ]),
      ],
      { title: "Login", layout: "centered" }
    ).render();
  }
}
