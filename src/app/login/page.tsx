import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import LoginClient from './login-client'; // ← 檔名小寫、同資料夾

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/profile');
  }
  return <LoginClient />;
}
