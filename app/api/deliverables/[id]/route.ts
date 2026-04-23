// app/api/deliverables/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { status, notes, link, title } = await req.json();
  const deliverable = await prisma.deliverable.update({
    where: { id: params.id },
    data: {
      ...(status && { status }),
      ...(notes !== undefined && { notes }),
      ...(link !== undefined && { link }),
      ...(title && { title }),
    },
  });
  return NextResponse.json(deliverable);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.deliverable.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
