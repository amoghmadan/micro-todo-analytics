import { AbstractComponent } from "./abstract.ts";
import type { SduiComponent } from "../types.ts";

export class CardComponent extends AbstractComponent {
  constructor(
    private readonly components: AbstractComponent[],
    private readonly title?: string,
  ) {
    super();
  }

  render(): SduiComponent {
    return {
      type: "card",
      props: {
        title: this.title,
        components: this.components.map((component) => component.render()),
      },
    };
  }
}
