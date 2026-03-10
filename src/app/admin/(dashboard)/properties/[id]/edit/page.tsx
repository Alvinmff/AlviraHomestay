import { PrismaClient } from "@prisma/client";
import { PropertyForm } from "@/components/admin/property-form";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
  });

  if (!property) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PropertyForm initialData={property} />
    </div>
  );
}
