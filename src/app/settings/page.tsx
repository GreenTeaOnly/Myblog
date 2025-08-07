// src/app/settings/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  // 伺服器端檢查 Session，未登入就導去 /login（SSR 階段就擋掉）
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // 透過 client 元件處理互動（主題切換、loading UX 等）
  return <SettingsClient />;
}
