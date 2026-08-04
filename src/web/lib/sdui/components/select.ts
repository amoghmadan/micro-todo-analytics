import { AbstractComponent } from "./abstract.ts";
import type { SduiComponent, SduiSelectProps } from "../types.ts";

export class SelectComponent extends AbstractComponent {
  private readonly props: SduiSelectProps;

  constructor(
    name: string,
    options: SduiSelectProps["options"],
    props: Omit<SduiSelectProps, "name" | "options"> = {},
  ) {
    super();
    this.props = { name, options, ...props };
  }

  render(): SduiComponent {
    return { type: "select", props: this.props };
  }
}
