import { AbstractComponent } from "./abstract.ts";
import type { SduiAction, SduiButtonProps, SduiComponent } from "../types.ts";

export class ButtonComponent extends AbstractComponent {
  private readonly props: SduiButtonProps;

  constructor(
    label: string,
    private readonly action?: SduiAction,
    props: Partial<SduiButtonProps> = {},
  ) {
    super();
    this.props = { label, ...props };
  }

  render(): SduiComponent {
    return {
      type: "button",
      props: this.props,
      ...(this.action ? { action: this.action } : {}),
    };
  }
}
