import { AbstractComponent } from "./abstract.ts";
import type { SduiComponent, SduiPaginationProps } from "../types.ts";

export class PaginationComponent extends AbstractComponent {
  constructor(
    private readonly page: number,
    private readonly totalPages: number,
    private readonly baseHref: string,
  ) {
    super();
  }

  render(): SduiComponent {
    return {
      type: "pagination",
      props: { page: this.page, totalPages: this.totalPages, baseHref: this.baseHref },
    };
  }
}
