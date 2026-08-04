import { AbstractComponent } from "./abstract.ts";
import type { SduiComponent, SduiLineChartProps } from "../types.ts";

export class LineChartComponent extends AbstractComponent {
  constructor(
    private readonly xKey: string,
    private readonly data: Record<string, unknown>[],
    private readonly series: SduiLineChartProps["series"],
    private readonly height = 400,
  ) {
    super();
  }

  render(): SduiComponent {
    return {
      type: "line-chart",
      props: { xKey: this.xKey, data: this.data, series: this.series, height: this.height },
    };
  }
}
