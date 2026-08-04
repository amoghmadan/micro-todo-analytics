import { AbstractComponent } from "./abstract.ts";
import type { SduiComponent, SduiTextProps } from "../types.ts";

export class TextComponent extends AbstractComponent {
  constructor(
    private readonly content: string,
    private readonly variant: SduiTextProps["variant"] = "body",
  ) {
    super();
  }

  render(): SduiComponent {
    return { type: "text", props: { content: this.content, variant: this.variant } };
  }
}
