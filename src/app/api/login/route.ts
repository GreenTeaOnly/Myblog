import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { z } from 'zod';
import { serialize } from 'cookie';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: '格式錯誤' }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: '帳號或密碼錯誤' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: '帳號或密碼錯誤' }, { status: 401 });
    }

    // 產生 JWT
    const token = signToken({ userId: user.id });

    // 設定 HTTP-only Cookie
    const cookie = serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 天
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json(
      { message: '登入成功' },
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
