import { AbstractComponent } from "./abstract.ts";
import type { SduiComponent, SduiItemProps } from "../types.ts";

export class ItemComponent extends AbstractComponent {
  constructor(private readonly props: SduiItemProps) {
    super();
  }

  render(): SduiComponent {
    return { type: "item", props: this.props };
  }
}
