import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const room = await prisma.room.findUnique({ where: { id: params.id } });
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const updated = await prisma.room.update({
      where: { id: params.id },
      data: { isShown: !room.isShown },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
