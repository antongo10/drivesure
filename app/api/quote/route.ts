import { NextResponse } from "next/server";
import { calculatePremium } from "@/lib/pricing";

export async function POST(req: Request) {
  const data = await req.json();
  const result = calculatePremium(data);
  return NextResponse.json(result);
}
