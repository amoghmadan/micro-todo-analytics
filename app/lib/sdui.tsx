import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useNavigate } from "react-router";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  SduiAction,
  SduiComponent,
  SduiItemEdit,
  SduiScreen,
} from "./sdui-types";
import { postAction, type ActionResponse } from "./api";

interface AlertState {
  kind: "success" | "error";
  text: string;
}

interface SduiContextValue {
  navigate: (to: string) => void;
  onRefetch?: () => void;
  refreshSession?: () => Promise<void>;
  pushAlert: (alert: AlertState) => void;
}

interface FormContextValue {
  submit: () => void;
  method: "post" | "get";
}

const SduiContext = createContext<SduiContextValue>({
  navigate: () => {},
  pushAlert: () => {},
});

const FormContext = createContext<FormContextValue | null>(null);

const TEXT_VARIANTS: Record<string, string> = {
  title: "text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white",
  h2: "text-xl font-bold tracking-tight text-gray-900 dark:text-white",
  h3: "text-lg font-semibold text-gray-900 dark:text-white",
  body: "text-sm text-gray-900 dark:text-white",
  muted: "text-sm text-gray-600 dark:text-gray-400",
  small: "text-xs text-gray-500 dark:text-gray-400",
};

function text(variant: string) {
  return TEXT_VARIANTS[variant] ?? TEXT_VARIANTS.body;
}

const BADGE_COLORS: Record<string, string> = {
  gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const BUTTON_VARIANTS: Record<string, string> = {
  primary:
    "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50",
  success:
    "rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white shadow-sm transition-colors hover:bg-green-700 active:bg-green-800 disabled:opacity-50",
  danger:
    "rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white shadow-sm transition-colors hover:bg-red-700 active:bg-red-800 disabled:opacity-50",
  ghost:
    "rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600",
  tab: "px-4 py-1.5 text-sm rounded-lg font-medium transition-colors",
};

const INPUT_CLASSES =
  "mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500";
const INLINE_INPUT_CLASSES =
  "flex-1 min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500";
const SELECT_CLASSES =
  "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white";

async function runApiAction(
  endpoint: string,
  body: Record<string, string>,
  ctx: SduiContextValue
): Promise<void> {
  let response: ActionResponse;
  try {
    response = await postAction(endpoint, body);
  } catch (error) {
    ctx.pushAlert({
      kind: "error",
      text: error instanceof Error ? error.message : "Request failed",
    });
    return;
  }

  if (response.redirect) {
    await ctx.refreshSession?.();
    ctx.navigate(response.redirect);
    return;
  }
  if (!response.ok) {
    ctx.pushAlert({ kind: "error", text: response.errors?.join(" ") ?? "Action failed" });
    return;
  }
  if (response.message) {
    ctx.pushAlert({ kind: "success", text: response.message });
  }
  ctx.onRefetch?.();
}

export interface ScreenRendererProps {
  screen: SduiScreen;
  onRefetch?: () => void;
  refreshSession?: () => Promise<void>;
}

export function ScreenRenderer({ screen, onRefetch, refreshSession }: ScreenRendererProps) {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<AlertState[]>([]);

  const pushAlert = useCallback((alert: AlertState) => {
    setAlerts((prev) => [...prev, alert]);
  }, []);

  const contextValue = useMemo<SduiContextValue>(
    () => ({ navigate, onRefetch, refreshSession, pushAlert }),
    [navigate, onRefetch, refreshSession, pushAlert]
  );

  const content = (
    <>
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`mb-4 rounded-lg border p-3 text-sm ${
            alert.kind === "success"
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/30 dark:text-green-200"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-200"
          }`}
        >
          {alert.text}
        </div>
      ))}
      {screen.components.map((comp, index) => (
        <ComponentRenderer key={index} comp={comp} />
      ))}
    </>
  );

  const wrapped = (
    <SduiContext.Provider value={contextValue}>{content}</SduiContext.Provider>
  );

  if (screen.layout === "centered") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 dark:bg-gray-950">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-5">{wrapped}</div>
        </div>
      </div>
    );
  }

  return <div className="space-y-5">{wrapped}</div>;
}

function ComponentRenderer({ comp }: { comp: SduiComponent }) {
  switch (comp.type) {
    case "text":
      return <p className={text(comp.props.variant ?? "body")}>{comp.props.content}</p>;
    case "link":
      return (
        <Link
          to={comp.props.to}
          className={
            comp.props.variant === "primary"
              ? "font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              : "font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          }
        >
          {comp.props.label}
        </Link>
      );
    case "button":
      return <ButtonComponent comp={comp} />;
    case "input":
      return <InputComponent comp={comp} />;
    case "select":
      return <SelectComponent comp={comp} />;
    case "form":
      return <FormComponent comp={comp} />;
    case "row":
      return (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {comp.props.components.map((child, index) => (
            <ComponentRenderer key={index} comp={child} />
          ))}
        </div>
      );
    case "card":
      return (
        <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {comp.props.title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {comp.props.title}
            </h3>
          )}
          {comp.props.components.map((child, index) => (
            <ComponentRenderer key={index} comp={child} />
          ))}
        </div>
      );
    case "list":
      return (
        <ul className="space-y-3">
          {comp.props.components.map((child, index) => (
            <ComponentRenderer key={index} comp={child} />
          ))}
        </ul>
      );
    case "item":
      return <ItemComponent comp={comp} />;
    case "empty":
      return (
        <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          {comp.props.text}
        </p>
      );
    case "alert":
      return (
        <div
          className={`rounded-lg border p-3 text-sm ${
            comp.props.kind === "success"
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/30 dark:text-green-200"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-200"
          }`}
        >
          {comp.props.text}
        </div>
      );
    case "line-chart":
      return <LineChartComponent comp={comp} />;
    case "pagination":
      return <PaginationComponent comp={comp} />;
    default:
      return null;
  }
}

function ButtonComponent({ comp }: { comp: Extract<SduiComponent, { type: "button" }> }) {
  const ctx = useContext(SduiContext);
  const { label, variant, active, disabled } = comp.props;

  const className = `${BUTTON_VARIANTS[variant ?? "primary"] ?? BUTTON_VARIANTS.primary} ${
    variant === "tab"
      ? active
        ? "bg-blue-600 text-white"
        : "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
      : ""
  }`;

  if (comp.action?.type === "navigate") {
    return (
      <Link to={comp.action.to} className={className}>
        {label}
      </Link>
    );
  }
  if (comp.action?.type === "api") {
    const action = comp.action;
    return (
      <button
        type="button"
        className={className}
        disabled={disabled}
        onClick={() => runApiAction(action.endpoint, action.body, ctx)}
      >
        {label}
      </button>
    );
  }
  if (comp.action?.type === "submit") {
    return (
      <button type="submit" className={className} disabled={disabled}>
        {label}
      </button>
    );
  }
  return (
    <button type="button" className={className} disabled={disabled}>
      {label}
    </button>
  );
}

function InputComponent({ comp }: { comp: Extract<SduiComponent, { type: "input" }> }) {
  const { name, label, type = "text", placeholder, required, minLength, defaultValue } = comp.props;

  if (type === "hidden") {
    return <input type="hidden" name={name} value={defaultValue ?? ""} />;
  }

  const input = (
    <input
      id={name}
      name={name}
      type={type}
      required={required}
      minLength={minLength}
      placeholder={placeholder}
      defaultValue={defaultValue ?? ""}
      className={label ? INPUT_CLASSES : INLINE_INPUT_CLASSES}
    />
  );

  if (!label) return input;

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      {input}
    </div>
  );
}

function SelectComponent({ comp }: { comp: Extract<SduiComponent, { type: "select" }> }) {
  const form = useContext(FormContext);
  const { name, label, defaultValue, options } = comp.props;

  return (
    <div>
      {label && (
        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className={SELECT_CLASSES}
        onChange={() => {
          if (form && form.method === "get") form.submit();
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FormComponent({ comp }: { comp: Extract<SduiComponent, { type: "form" }> }) {
  const ctx = useContext(SduiContext);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const formContextValue = useMemo<FormContextValue>(
    () => ({
      submit: () => formRef.current?.requestSubmit(),
      method: comp.props.method ?? "post",
    }),
    [comp.props.method]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (comp.props.method === "get") {
      const params = new URLSearchParams();
      new FormData(form).forEach((value, key) => params.set(key, String(value)));
      ctx.navigate(`${comp.props.action}${params.size ? `?${params.toString()}` : ""}`);
      return;
    }

    const fields: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
      fields[key] = String(value);
    });

    setSubmitting(true);
    await runApiAction(comp.props.action, fields, ctx);
    setSubmitting(false);
  };

  return (
    <FormContext.Provider value={formContextValue}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={
          comp.props.layout === "inline"
            ? "flex flex-col gap-3 sm:flex-row sm:items-end"
            : "space-y-4"
        }
      >
        {comp.props.fields.map((field, index) => (
          <ComponentRenderer key={index} comp={field} />
        ))}
        {comp.props.submitLabel && (
          <button
            type="submit"
            disabled={submitting}
            className={`${BUTTON_VARIANTS.primary} ${
              comp.props.layout === "inline" ? "" : "w-full"
            }`}
          >
            {submitting ? "Working..." : comp.props.submitLabel}
          </button>
        )}
      </form>
    </FormContext.Provider>
  );
}

function ItemComponent({ comp }: { comp: Extract<SduiComponent, { type: "item" }> }) {
  const ctx = useContext(SduiContext);
  const { description, meta, badge, statusField, edit, actions } = comp.props;
  const [editing, setEditing] = useState(false);
  const [editDesc, setEditDesc] = useState(edit?.description ?? description);
  const [editStatus, setEditStatus] = useState(edit?.status ?? "");

  if (editing && edit) {
    return (
      <li className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <input
          type="text"
          value={editDesc}
          onChange={(event) => setEditDesc(event.target.value)}
          className={INPUT_CLASSES}
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={editStatus}
            onChange={(event) => setEditStatus(event.target.value)}
            className={SELECT_CLASSES}
          >
            {edit.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="flex gap-2 sm:ml-auto">
            <button
              type="button"
              className={BUTTON_VARIANTS.success}
              onClick={() =>
                runApiAction(edit.endpoint, { id: comp.props.key, description: editDesc, status: editStatus }, ctx)
              }
            >
              Save
            </button>
            <button
              type="button"
              className={BUTTON_VARIANTS.ghost}
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-gray-900 dark:text-white">{description}</p>
        {meta && <p className="mt-0.5 text-xs text-gray-500">{meta}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {statusField && (
          <select
            value={statusField.value}
            className={`rounded-md border-0 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200`}
            onChange={(event) =>
              runApiAction(statusField.endpoint, { id: statusField.id, status: event.target.value }, ctx)
            }
          >
            {statusField.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
        {badge && (
          <span
            className={`rounded-md px-2 py-1 text-xs font-medium ${
              BADGE_COLORS[badge.color] ?? BADGE_COLORS.gray
            }`}
          >
            {badge.label}
          </span>
        )}
        {edit && (
          <button
            type="button"
            className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => {
              setEditDesc(edit.description);
              setEditStatus(edit.status);
              setEditing(true);
            }}
          >
            Edit
          </button>
        )}
        {actions?.map(({ label, action }, index) => (
          <ActionButton key={index} label={label} action={action} />
        ))}
      </div>
    </li>
  );
}

function ActionButton({ label, action }: { label: string; action: SduiAction }) {
  const ctx = useContext(SduiContext);

  if (action.type === "api") {
    return (
      <button
        type="button"
        className="text-xs font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        onClick={() => runApiAction(action.endpoint, action.body, ctx)}
      >
        {label}
      </button>
    );
  }
  if (action.type === "navigate") {
    return (
      <button
        type="button"
        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        onClick={() => ctx.navigate(action.to)}
      >
        {label}
      </button>
    );
  }
  return null;
}

function LineChartComponent({
  comp,
}: {
  comp: Extract<SduiComponent, { type: "line-chart" }>;
}) {
  const { xKey, data, series, height } = comp.props;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <ResponsiveContainer width="100%" height={height ?? 400}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          />
          <Legend />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function PaginationComponent({
  comp,
}: {
  comp: Extract<SduiComponent, { type: "pagination" }>;
}) {
  const { page, totalPages, baseHref } = comp.props;
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) =>
    `${baseHref}${baseHref.includes("?") ? "&" : "?"}page=${target}`;
  const linkClasses =
    "px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700";

  return (
    <div className="flex items-center justify-center gap-2">
      {page > 1 && (
        <Link to={hrefFor(page - 1)} className={linkClasses}>
          Previous
        </Link>
      )}
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <Link to={hrefFor(page + 1)} className={linkClasses}>
          Next
        </Link>
      )}
    </div>
  );
}
