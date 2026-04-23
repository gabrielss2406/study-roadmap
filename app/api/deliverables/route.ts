// app/api/deliverables/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const deliverables = await prisma.deliverable.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(deliverables);
}

export async function POST(req: NextRequest) {
  const { monthId, title, notes, link } = await req.json();
  if (!monthId || !title) {
    return NextResponse.json({ error: "monthId and title required" }, { status: 400 });
  }
  const deliverable = await prisma.deliverable.create({
    data: { monthId, title, notes, link, status: "PENDING" },
  });
  return NextResponse.json(deliverable);
}
