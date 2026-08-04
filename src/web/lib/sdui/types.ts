export type BadgeColor = "gray" | "blue" | "green" | "red";

export type SduiAction =
  | { type: "submit" }
  | { type: "navigate"; to: string }
  | { type: "api"; endpoint: string; body: Record<string, string> };

export interface SduiTextProps {
  content: string;
  variant?: "title" | "h2" | "h3" | "body" | "muted" | "small";
}

export interface SduiLinkProps {
  to: string;
  label: string;
  variant?: "primary" | "ghost";
}

export interface SduiButtonProps {
  label: string;
  variant?: "primary" | "success" | "danger" | "ghost" | "tab";
  active?: boolean;
  disabled?: boolean;
}

export interface SduiInputProps {
  name: string;
  label?: string;
  type?: "text" | "email" | "password" | "date" | "hidden";
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  defaultValue?: string;
}

export interface SduiSelectProps {
  name: string;
  label?: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}

export interface SduiFormProps {
  action: string;
  method?: "post" | "get";
  layout?: "stack" | "inline";
  submitLabel?: string;
  fields: SduiComponent[];
}

export interface SduiRowProps {
  components: SduiComponent[];
}

export interface SduiCardProps {
  title?: string;
  components: SduiComponent[];
}

export interface SduiListProps {
  components: SduiComponent[];
}

export interface SduiItemStatusField {
  id: string;
  value: string;
  options: { value: string; label: string }[];
  endpoint: string;
}

export interface SduiItemEdit {
  endpoint: string;
  description: string;
  status: string;
  options: { value: string; label: string }[];
}

export interface SduiItemProps {
  key: string;
  description: string;
  meta?: string;
  badge?: { label: string; color: BadgeColor };
  statusField?: SduiItemStatusField;
  edit?: SduiItemEdit;
  actions?: { label: string; action: SduiAction }[];
}

export interface SduiLineChartProps {
  xKey: string;
  data: Record<string, unknown>[];
  series: { key: string; name: string; color: string }[];
  height?: number;
}

export interface SduiPaginationProps {
  page: number;
  totalPages: number;
  baseHref: string;
}

export type SduiComponent =
  | { type: "text"; props: SduiTextProps }
  | { type: "link"; props: SduiLinkProps }
  | { type: "button"; props: SduiButtonProps; action?: SduiAction }
  | { type: "input"; props: SduiInputProps }
  | { type: "select"; props: SduiSelectProps }
  | { type: "form"; props: SduiFormProps }
  | { type: "row"; props: SduiRowProps }
  | { type: "card"; props: SduiCardProps }
  | { type: "list"; props: SduiListProps }
  | { type: "item"; props: SduiItemProps }
  | { type: "empty"; props: { text: string } }
  | { type: "alert"; props: { kind: "success" | "error"; text: string } }
  | { type: "line-chart"; props: SduiLineChartProps }
  | { type: "pagination"; props: SduiPaginationProps };

export interface SduiScreen {
  screen: string;
  title?: string;
  layout?: "default" | "centered";
  components: SduiComponent[];
}
