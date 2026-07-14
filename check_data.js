const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bookings = await prisma.booking.findMany({
    select: {
      id: true,
      guestName: true,
      checkIn: true,
      checkOut: true,
      createdAt: true,
      status: true,
      totalPrice: true,
      dpAmount: true,
      groupId: true,
      paymentStatus: true
    },
    orderBy: { checkIn: 'desc' }
  });
  console.log(JSON.stringify(bookings, null, 2));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
