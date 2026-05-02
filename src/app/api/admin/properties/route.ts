import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
}

export async function GET() {
    try {
        const properties = await prisma.property.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                city: true,
            }
        });
        return NextResponse.json(properties);
    } catch (error: unknown) {
        console.error("Fetch properties error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Auto-generate slug
        const slug = generateSlug(data.name);

        const property = await prisma.property.create({
            data: {
                name: data.name,
                slug,
                type: data.type,
                city: data.city,
                description: data.description || "",
                address: data.address || "",
                latitude: data.latitude ? parseFloat(data.latitude) : null,
                longitude: data.longitude ? parseFloat(data.longitude) : null,
                heroImage: data.heroImage || null,
                commonFacilities: data.commonFacilities ? JSON.parse(data.commonFacilities) : [],
                gallery: data.gallery ? JSON.parse(data.gallery) : [],
                nearbyPlaces: data.nearbyPlaces ? JSON.parse(data.nearbyPlaces) : [],
            }
        });

        return NextResponse.json(property);
    } catch (error: unknown) {
        console.error("Create property error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
