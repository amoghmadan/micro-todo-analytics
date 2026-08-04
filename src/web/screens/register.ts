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

export class RegisterScreen extends AbstractComponent<Promise<SduiScreen>> {
  async render(): Promise<SduiScreen> {
    return new ScreenComponent(
      "register",
      [
        new TextComponent("Create Account", "title"),
        new FormComponent(
          "register",
          [
            new RowComponent([
              new InputComponent("firstName", { label: "First name", required: true }),
              new InputComponent("lastName", { label: "Last name", required: true }),
            ]),
            new InputComponent("email", { label: "Email", type: "email", required: true }),
            new InputComponent("password", {
              label: "Password",
              type: "password",
              required: true,
              minLength: 8,
            }),
            new InputComponent("confirmPassword", {
              label: "Confirm password",
              type: "password",
              required: true,
              minLength: 8,
            }),
          ],
          { submitLabel: "Create account" }
        ),
        new RowComponent([
          new TextComponent("Already have an account? ", "muted"),
          new LinkComponent("/login", "Sign in", "primary"),
        ]),
      ],
      { title: "Register", layout: "centered" }
    ).render();
  }
}
