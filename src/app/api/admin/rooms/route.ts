import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Auto-generate slug to prevent conflicts
    const slug = generateSlug(data.roomName);
    
    const room = await prisma.room.create({
      data: {
        ...data,
        slug,
      }
    });

    return NextResponse.json(room);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
