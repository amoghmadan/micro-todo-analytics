import { AbstractComponent } from "./abstract.ts";
import type { SduiScreen } from "../types.ts";

export class ScreenComponent extends AbstractComponent<SduiScreen> {
  constructor(
    private readonly name: string,
    private readonly components: AbstractComponent[],
    private readonly options: { title?: string; layout?: "default" | "centered" } = {},
  ) {
    super();
  }

  render(): SduiScreen {
    return {
      screen: this.name,
      title: this.options.title,
      layout: this.options.layout,
      components: this.components.map((component) => component.render()),
    };
  }
}
