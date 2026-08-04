import {
  AbstractComponent,
  EmptyComponent,
  FormComponent,
  InputComponent,
  ItemComponent,
  ListComponent,
  PaginationComponent,
  RowComponent,
  ScreenComponent,
  SelectComponent,
  TextComponent,
} from "../lib/sdui/index.ts";
import type { SduiScreen } from "../lib/sdui/index.ts";
import { GatewayError, listTasks } from "../lib/gateway.ts";
import type { TaskItem } from "../lib/gateway.ts";
import type { ScreenContext } from "./index.ts";

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: "STATUS_TODO_UNSPECIFIED", label: "To Do" },
  { value: "STATUS_IN_PROGRESS", label: "In Progress" },
  { value: "STATUS_DONE", label: "Done" },
  { value: "STATUS_SCRAPED", label: "Scraped" },
];

export class DashboardScreen extends AbstractComponent<Promise<SduiScreen>> {
  constructor(private readonly ctx: ScreenContext) {
    super();
  }

  async render(): Promise<SduiScreen> {
    const session = this.ctx.session;
    if (!session) throw new GatewayError("Unauthenticated", 401);

    const requestedPage = Number.parseInt(this.ctx.query.page ?? "1", 10);
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const status = this.ctx.query.status;

    const listResult = await listTasks(session.token, {
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      ordering: "-updatedAt",
      ...(status ? { status } : {}),
    });

    const totalPages = Math.max(1, Math.ceil(listResult.count / PAGE_SIZE));

    const components: AbstractComponent[] = [
      new TextComponent("Tasks", "h2"),
      new FormComponent(
        "create-task",
        [new InputComponent("description", { placeholder: "Add a new task...", required: true })],
        { layout: "inline", submitLabel: "Add" }
      ),
      new RowComponent([
        new FormComponent(
          "/dashboard",
          [new SelectComponent("status", [{ value: "", label: "All statuses" }, ...STATUS_OPTIONS], { defaultValue: status ?? "" })],
          { method: "get", layout: "inline", submitLabel: "Filter" }
        ),
        new TextComponent(`${listResult.count} ${listResult.count === 1 ? "task" : "tasks"}`, "small"),
      ]),
    ];

    if (listResult.results.length === 0) {
      components.push(
        new EmptyComponent(status ? "No tasks match this filter." : "No tasks yet. Add one above!")
      );
    } else {
      components.push(new ListComponent(listResult.results.map((task) => taskComponent(task))));
    }

    if (totalPages > 1) {
      const baseHref = "/dashboard" + (status ? `?status=${encodeURIComponent(status)}` : "");
      components.push(new PaginationComponent(page, totalPages, baseHref));
    }

    return new ScreenComponent("dashboard", components, { title: "Dashboard" }).render();
  }
}

function taskComponent(task: TaskItem): ItemComponent {
  return new ItemComponent({
    key: task.id,
    description: task.description,
    meta: new Date(task.createdAt).toLocaleDateString(),
    statusField: {
      id: task.id,
      value: task.status,
      options: STATUS_OPTIONS,
      endpoint: "update-task",
    },
    edit: {
      endpoint: "update-task",
      description: task.description,
      status: task.status,
      options: STATUS_OPTIONS,
    },
    actions: [{ label: "Delete", action: { type: "api", endpoint: "delete-task", body: { id: task.id } } }],
  });
}
