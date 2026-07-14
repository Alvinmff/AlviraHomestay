const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update all bookings where dpAmount >= totalPrice and status is not cancelled to PAID
  const bookingsToCorrect = await prisma.booking.findMany({
    where: {
      status: { notIn: ["CANCELLED"] },
      paymentStatus: "UNPAID"
    }
  });

  let correctedCount = 0;
  for (const b of bookingsToCorrect) {
    if ((b.dpAmount || 0) >= b.totalPrice) {
      await prisma.booking.update({
        where: { id: b.id },
        data: { paymentStatus: "PAID" }
      });
      correctedCount++;
    }
  }
  console.log(`Berhasil memperbarui ${correctedCount} status pembayaran ke PAID.`);

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
