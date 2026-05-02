import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { isVisible, authorName, authorPhoto, rating, text, propertyId, roomId, reviewDate } = body;

    const existingReview = await prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review tidak ditemukan" }, { status: 404 });
    }

    // Izinkan edit semua field untuk semua sumber (termasuk Google)
    const updated = await prisma.review.update({
      where: { id },
      data: {
        isVisible: isVisible !== undefined ? isVisible : existingReview.isVisible,
        authorName: authorName || existingReview.authorName,
        authorPhoto: authorPhoto !== undefined ? authorPhoto : existingReview.authorPhoto,
        rating: rating ? Number(rating) : existingReview.rating,
        text: text || existingReview.text,
        propertyId: propertyId !== undefined ? propertyId : existingReview.propertyId,
        roomId: roomId !== undefined ? roomId : existingReview.roomId,
        reviewDate: reviewDate ? new Date(reviewDate) : existingReview.reviewDate,
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update review error:", error);
    return NextResponse.json({ error: "Gagal update ulasan: " + error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Periksa dulu apakah review ada dan dapat dihapus
    await prisma.review.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Ulasan berhasil dihapus" });
  } catch (error: any) {
    console.error("Delete review error:", error);
    return NextResponse.json({ error: "Gagal menghapus ulasan: " + error.message }, { status: 500 });
  }
}
