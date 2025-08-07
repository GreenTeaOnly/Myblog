import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }
  // 用 userId 拿資料
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  return new Response(JSON.stringify({ username: user.username, email: user.email }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
