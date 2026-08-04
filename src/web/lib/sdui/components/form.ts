import { AbstractComponent } from "./abstract.ts";
import type { SduiComponent, SduiFormProps } from "../types.ts";

export class FormComponent extends AbstractComponent {
  private readonly props: Omit<SduiFormProps, "action" | "fields">;

  constructor(
    private readonly action: string,
    private readonly fields: AbstractComponent[],
    props: Omit<SduiFormProps, "action" | "fields"> = {},
  ) {
    super();
    this.props = props;
  }

  render(): SduiComponent {
    return {
      type: "form",
      props: {
        action: this.action,
        fields: this.fields.map((field) => field.render()),
        ...this.props,
      },
    };
  }
}
