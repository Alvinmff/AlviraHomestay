import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const property = await prisma.property.findUnique({
            where: { id: params.id },
        });

        if (!property) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        // Cascade delete is handled by Prisma or database if configured,
        // otherwise we might need to delete rooms first. 
        // In schema.prisma, Room has: property Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)

        await prisma.property.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true, message: "Properti berhasil dihapus" });
    } catch (error: unknown) {
        console.error("Delete property error:", error);
        return NextResponse.json({ error: "Gagal menghapus properti" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const data = await req.json();

        const property = await prisma.property.update({
            where: { id: params.id },
            data: {
                name: data.name,
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
        console.error("Update property error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
