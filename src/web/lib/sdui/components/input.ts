import { AbstractComponent } from "./abstract.ts";
import type { SduiComponent, SduiInputProps } from "../types.ts";

export class InputComponent extends AbstractComponent {
  private readonly props: SduiInputProps;

  constructor(name: string, props: Omit<SduiInputProps, "name"> = {}) {
    super();
    this.props = { name, ...props };
  }

  render(): SduiComponent {
    return { type: "input", props: this.props };
  }
}
