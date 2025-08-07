'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <p>載入中...</p>;
  if (!session) return null;

  return (
    <div>
      <h1>歡迎 {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
      <button onClick={() => signOut({ callbackUrl: "/login" })}>登出</button>
    </div>
  );
}
