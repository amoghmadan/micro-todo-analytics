import { ScreenPage } from "../lib/screen-page";

export function meta() {
  return [{ title: "Dashboard - Micro Todo Analytics" }];
}

export default function Dashboard() {
  return <ScreenPage screen="dashboard" />;
}
