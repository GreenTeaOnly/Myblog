import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const RegisterSchema = z.object({
  username: z.string().min(2, '使用者名稱至少 2 個字'),
  email: z.string().email('Email 格式不正確'),
  password: z
    .string()
    .min(8, '密碼至少 8 碼')
    .regex(/[A-Z]/, '需含大寫字母')
    .regex(/[a-z]/, '需含小寫字母')
    .regex(/[0-9]/, '需含數字'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: '驗證失敗', issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { username, email, password } = parsed.data;

    // 檢查 Email 是否存在
    const existed = await prisma.user.findUnique({ where: { email } });
    if (existed) {
      return NextResponse.json({ error: '此 Email 已被註冊' }, { status: 409 });
    }

    // 雜湊密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 建立帳號
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
