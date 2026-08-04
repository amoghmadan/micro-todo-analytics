import { AbstractComponent } from "./abstract.ts";
import type { SduiComponent } from "../types.ts";

export class ListComponent extends AbstractComponent {
  constructor(private readonly components: AbstractComponent[]) {
    super();
  }

  render(): SduiComponent {
    return {
      type: "list",
      props: { components: this.components.map((component) => component.render()) },
    };
  }
}
