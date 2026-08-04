import { ScreenPage } from "../lib/screen-page";

export function meta() {
  return [{ title: "Profile - Micro Todo Analytics" }];
}

export default function Profile() {
  return <ScreenPage screen="profile" />;
}
