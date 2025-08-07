// src/app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 以 email 查當前使用者
  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, username: true, email: true, createdAt: true },
  });

  if (!me) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(me, { status: 200 });
}
