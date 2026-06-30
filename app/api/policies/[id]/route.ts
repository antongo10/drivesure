import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;
  const policy = await prisma.policy.findFirst({
    where: { id, userId: session.user.id },
    include: { vehicle: true, drivers: true, address: true, payment: true },
  });

  if (!policy) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(policy);
}
