import { AbstractComponent } from "./abstract.ts";
import type { SduiComponent } from "../types.ts";

export class EmptyComponent extends AbstractComponent {
  constructor(private readonly textValue: string) {
    super();
  }

  render(): SduiComponent {
    return { type: "empty", props: { text: this.textValue } };
  }
}
