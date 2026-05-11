import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const bookings = await prisma.booking.findMany({
    where: { guestName: { contains: 'Wahyu' } },
    select: { id: true, guestName: true, dpAmount: true, totalPrice: true, groupId: true }
  });
  console.log(JSON.stringify(bookings, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
