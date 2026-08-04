import { AbstractComponent } from "./abstract.ts";
import type { SduiComponent } from "../types.ts";

export class AlertComponent extends AbstractComponent {
  constructor(
    private readonly kind: "success" | "error",
    private readonly textValue: string,
  ) {
    super();
  }

  render(): SduiComponent {
    return { type: "alert", props: { kind: this.kind, text: this.textValue } };
  }
}
