import {
  AbstractComponent,
  ButtonComponent,
  EmptyComponent,
  FormComponent,
  InputComponent,
  LineChartComponent,
  RowComponent,
  ScreenComponent,
  TextComponent,
} from "../lib/sdui/index.ts";
import type { SduiScreen } from "../lib/sdui/index.ts";
import { GatewayError, getAnalytics, type AnalyticsPeriod } from "../lib/gateway.ts";
import type { ScreenContext } from "./index.ts";

const PERIODS: AnalyticsPeriod[] = ["day", "week", "month", "year"];

const PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
};

const SERIES = [
  { key: "todo", name: "To Do", color: "#6b7280" },
  { key: "inProgress", name: "In Progress", color: "#3b82f6" },
  { key: "done", name: "Done", color: "#22c55e" },
  { key: "scraped", name: "Scraped", color: "#ef4444" },
];

const PERIOD_FIELD = {
  day: "hour",
  week: "weekday",
  month: "week",
  year: "month",
} as const;

export class AnalyticsScreen extends AbstractComponent<Promise<SduiScreen>> {
  constructor(private readonly ctx: ScreenContext) {
    super();
  }

  async render(): Promise<SduiScreen> {
    const session = this.ctx.session;
    if (!session) throw new GatewayError("Unauthenticated", 401);

    const period = (PERIODS as string[]).includes(this.ctx.query.period ?? "")
      ? (this.ctx.query.period as AnalyticsPeriod)
      : "day";
    const date = this.ctx.query.date ?? new Date().toISOString().slice(0, 10);

    const entries = await getAnalytics(session.token, period, date);
    const data = entries.map((entry) => {
      const time = (entry[PERIOD_FIELD[period]] as string) ?? "";
      return {
        time,
        todo: entry.counts?.todo ?? 0,
        inProgress: entry.counts?.inProgress ?? 0,
        done: entry.counts?.done ?? 0,
        scraped: entry.counts?.scraped ?? 0,
      };
    });

    const components: AbstractComponent[] = [
      new TextComponent("Analytics", "h2"),
      new RowComponent(
        PERIODS.map(
          (p) =>
            new ButtonComponent(
              PERIOD_LABELS[p],
              { type: "navigate", to: `/analytics?period=${p}&date=${date}` },
              { variant: "tab", active: p === period }
            )
        )
      ),
      new FormComponent(
        "/analytics",
        [
          new InputComponent("period", { type: "hidden", defaultValue: period }),
          new InputComponent("date", { type: "date", label: "Date", required: true, defaultValue: date }),
        ],
        { method: "get", layout: "inline", submitLabel: "Go" }
      ),
    ];

    if (data.length === 0) {
      components.push(new EmptyComponent("No analytics data for this period."));
    } else {
      components.push(new LineChartComponent("time", data, SERIES));
    }

    return new ScreenComponent("analytics", components, { title: "Analytics" }).render();
  }
}
