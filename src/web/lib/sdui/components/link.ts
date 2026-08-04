import { AbstractComponent } from "./abstract.ts";
import type { SduiComponent, SduiLinkProps } from "../types.ts";

export class LinkComponent extends AbstractComponent {
  constructor(
    private readonly to: string,
    private readonly label: string,
    private readonly variant: SduiLinkProps["variant"] = "ghost",
  ) {
    super();
  }

  render(): SduiComponent {
    return { type: "link", props: { to: this.to, label: this.label, variant: this.variant } };
  }
}
