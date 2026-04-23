// app/api/topics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks = await prisma.topicCheck.findMany();
  const map: Record<string, boolean> = {};
  for (const c of checks) map[c.topicKey] = c.done;
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  const { key, done } = await req.json();
  if (!key || typeof done !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const result = await prisma.topicCheck.upsert({
    where: { topicKey: key },
    update: { done },
    create: { topicKey: key, done },
  });
  return NextResponse.json(result);
}
