import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPolicyConfirmationEmail } from "@/lib/email";

function generatePolicyNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const prefix = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const numbers = Math.floor(100000 + Math.random() * 900000);
  return `DS-${prefix}-${numbers}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const policies = await prisma.policy.findMany({
    where: { userId: session.user.id },
    include: { vehicle: true, drivers: true, address: true, payment: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(policies);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json();
  const { vehicle, drivers, address, payment, coverType, paymentFrequency, annualPremium, monthlyPremium } = body;

  const policyNumber = generatePolicyNumber();
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  const policy = await prisma.policy.create({
    data: {
      policyNumber,
      userId: session.user.id,
      status: "active",
      startDate,
      endDate,
      coverType,
      annualPremium,
      monthlyPremium,
      paymentFrequency,
      vehicle: { create: vehicle },
      drivers: {
        create: drivers.map((d: Record<string, unknown>) => ({
          ...d,
          dateOfBirth: new Date(d.dateOfBirth as string),
        })),
      },
      address: { create: address },
      payment: {
        create: {
          ...payment,
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          amount: paymentFrequency === "annual" ? annualPremium : monthlyPremium,
        },
      },
    },
    include: { vehicle: true, drivers: true, address: true },
  });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user) {
    await sendPolicyConfirmationEmail({
      to: user.email,
      firstName: user.firstName,
      policyNumber: policy.policyNumber,
      coverType: policy.coverType,
      startDate: policy.startDate.toLocaleDateString("en-GB"),
      endDate: policy.endDate.toLocaleDateString("en-GB"),
      vehicle: `${policy.vehicle?.year} ${policy.vehicle?.make} ${policy.vehicle?.model}`,
      premium: paymentFrequency === "annual" ? annualPremium : monthlyPremium,
      frequency: paymentFrequency === "annual" ? "per year" : "per month",
    }).catch(console.error);
  }

  return NextResponse.json(policy, { status: 201 });
}
