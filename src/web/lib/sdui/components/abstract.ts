import type { SduiComponent } from "../types.ts";

export abstract class AbstractComponent<TRender = SduiComponent> {
  abstract render(): TRender;
}
