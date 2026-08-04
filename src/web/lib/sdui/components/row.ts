import { AbstractComponent } from "./abstract.ts";
import type { SduiComponent } from "../types.ts";

export class RowComponent extends AbstractComponent {
  constructor(private readonly components: AbstractComponent[]) {
    super();
  }

  render(): SduiComponent {
    return {
      type: "row",
      props: { components: this.components.map((component) => component.render()) },
    };
  }
}
