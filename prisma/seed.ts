import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Starting full database seeder (Phase 4)...')

  // --- 1. SUPER ADMIN SEEDING ---
  const adminEmail = 'admin@alvirahomestay.com'
  const adminPassword = 'AlviraAdmin2026!'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  let superAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail }
  })

  if (!superAdmin) {
    superAdmin = await prisma.admin.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        name: 'Super Administrator',
        role: 'SUPER_ADMIN'
      }
    })
    console.log(`✅ Super Admin created: ${adminEmail}`)
  } else {
    // Ensure password matches if re-running
    superAdmin = await prisma.admin.update({
      where: { email: adminEmail },
      data: { passwordHash: hashedPassword }
    });
    console.log(`ℹ️ Super Admin existing (updated password)`)
  }

  // --- 2. CLEAR EXISTING DATA ---
  // We'll delete properties first, and due to Cascade, rooms will be deleted.
  // Bookings and Availabilities aren't cascading, so let's clear them manually in reverse topological order.
  await prisma.roomAvailability.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.property.deleteMany({});
  console.log(`🧹 Cleared old properties, rooms, bookings, and availabilities.`)

  // --- 3. SEED PROPERTIES ---
  const propertiesData = [
    {
      name: "Alvira Homestay Sidoarjo",
      slug: "sidoarjo",
      city: "SIDOARJO",
      type: "HOMESTAY",
      address: "Pusat Kota Sidoarjo",
      description: "Penginapan nyaman dan strategis untuk keluarga, cocok untuk transit atau kunjungan bisnis.",
      commonFacilities: ["Parkir Luas", "Lobby", "Security 24 Jam", "WiFi Area Umum"],
      heroImage: "/images/properties/sidoarjo-hero.jpg"
    },
    {
      name: "Kost Eksklusif Surabaya",
      slug: "surabaya",
      city: "SURABAYA",
      type: "KOST",
      address: "Pusat Kota Surabaya",
      description: "Fasilitas premium di pusat kota pahlawan, memberikan kenyamanan maksimal untuk mahasiswa dan pekerja.",
      commonFacilities: ["Parkir Motor", "Dapur Bersama", "CCTV", "Ruang Cuci/Jemur"],
      heroImage: "/images/properties/surabaya-hero.jpg"
    },
    {
      name: "Villa Premium Batu",
      slug: "batu",
      city: "BATU",
      type: "VILLA",
      address: "Kawasan Pegunungan Batu",
      description: "Liburan tak terlupakan dengan nuansa alam pegunungan, udara sejuk, dan privasi penuh.",
      commonFacilities: ["Parkir 4 Mobil", "Taman Luas", "BBQ Area", "Security Area"],
      heroImage: "/images/properties/batu-hero.jpg"
    }
  ];

  const createdProperties = [];
  for (const prop of propertiesData) {
    const created = await prisma.property.create({
      data: prop
    });
    createdProperties.push(created);
    console.log(`🏠 Created property: ${created.name}`);
  }

  const propSidoarjo = createdProperties.find(p => p.slug === "sidoarjo");
  const propSurabaya = createdProperties.find(p => p.slug === "surabaya");
  const propBatu = createdProperties.find(p => p.slug === "batu");

  // --- 4. SEED ROOMS ---
  if (!propSidoarjo || !propSurabaya || !propBatu) {
    throw new Error("Missing properties!");
  }

  const placeholderPhotos = [
    "/images/placeholder-room.jpg",
    "/images/placeholder-room-alt.jpg"
  ];

  // SIDOARJO (7 Rooms)
  const sidoarjoRooms = [
    { number: "101", name: "Deluxe Garden View", size: "24m²", guests: 2, price: 350000, bed: "Queen Bed", amenities: ["AC", "TV", "WiFi", "Kamar Mandi Dalam", "Water Heater"] },
    { number: "102", name: "Deluxe Pool View", size: "24m²", guests: 2, price: 375000, bed: "Queen Bed", amenities: ["AC", "Smart TV 32\"", "WiFi", "Kamar Mandi Dalam", "Water Heater", "Mini Kulkas"] },
    { number: "103", name: "Family Room A", size: "32m²", guests: 4, price: 500000, bed: "2 Double Beds", amenities: ["AC", "TV", "WiFi", "Kamar Mandi Dalam", "Water Heater", "Balkon"] },
    { number: "201", name: "Executive Suite", size: "28m²", guests: 2, price: 425000, bed: "King Bed", amenities: ["AC", "Smart TV 43\"", "WiFi 5G", "Kamar Mandi Dalam", "Water Heater", "Sofa", "Work Desk"] },
    { number: "202", name: "Family Room B", size: "35m²", guests: 4, price: 550000, bed: "2 Double Beds", amenities: ["AC", "TV", "WiFi", "Kamar Mandi Dalam", "Water Heater", "Kitchenette"] },
    { number: "203", name: "Premium Corner", size: "30m²", guests: 2, price: 450000, bed: "King Bed", amenities: ["AC", "Smart TV", "WiFi", "Kamar Mandi Dalam", "Water Heater", "Mini Bar", "City View"] },
    { number: "204", name: "Budget Standard", size: "20m²", guests: 2, price: 275000, bed: "Twin Bed", amenities: ["AC", "TV", "WiFi", "Kamar Mandi Dalam"] }
  ];

  for (const r of sidoarjoRooms) {
    await prisma.room.create({
      data: {
        propertyId: propSidoarjo.id,
        roomNumber: r.number,
        roomName: r.name,
        slug: `sidoarjo-${r.number.toLowerCase()}`,
        description: `Kamar ${r.name} di Alvira Homestay Sidoarjo menawarkan kenyamanan optimal dengan luas ${r.size}.`,
        maxGuests: r.guests,
        roomSize: r.size,
        bedType: r.bed,
        amenities: r.amenities,
        photos: placeholderPhotos,
        thumbnail: "/images/placeholder-room.jpg",
        basePrice: r.price,
        weekendPrice: r.price + 50000,
      }
    });
  }
  console.log(`🛏️ Seeded 7 Sidoarjo Rooms`);

  // SURABAYA (6 Rooms)
  const surabayaRooms = [
    { number: "A-01", name: "Kost Executive Lt.1", size: "18m²", guests: 1, dailyPrice: 150000, monthlyPrice: 2500000, bed: "Single Bed", amenities: ["AC", "TV", "WiFi", "Kamar Mandi Dalam", "Lemari", "Meja Belajar", "Dapur Bersama"] },
    { number: "A-02", name: "Kost Executive Lt.1", size: "18m²", guests: 1, dailyPrice: 150000, monthlyPrice: 2500000, bed: "Single Bed", amenities: ["AC", "TV", "WiFi", "Kamar Mandi Dalam", "Lemari", "Meja Belajar", "Dapur Bersama"] },
    { number: "B-01", name: "Kost Premium Lt.2", size: "22m²", guests: 1, dailyPrice: 175000, monthlyPrice: 2800000, bed: "Super Single Bed", amenities: ["AC", "Smart TV", "WiFi", "Kamar Mandi Dalam", "Lemari Besar", "Meja Kerja", "Balkon Kecil"] },
    { number: "B-02", name: "Kost Premium Lt.2", size: "22m²", guests: 1, dailyPrice: 175000, monthlyPrice: 2800000, bed: "Super Single Bed", amenities: ["AC", "Smart TV", "WiFi", "Kamar Mandi Dalam", "Lemari Besar", "Meja Kerja", "Balkon Kecil"] },
    { number: "C-01", name: "Kost Standard Lt.3", size: "16m²", guests: 1, dailyPrice: 125000, monthlyPrice: 2200000, bed: "Single Bed", amenities: ["AC", "TV", "WiFi", "Kamar Mandi Dalam", "Lemari", "Meja"] },
    { number: "C-02", name: "Kost Standard Lt.3", size: "16m²", guests: 1, dailyPrice: 125000, monthlyPrice: 2200000, bed: "Single Bed", amenities: ["AC", "TV", "WiFi", "Kamar Mandi Dalam", "Lemari", "Meja"] }
  ];

  for (const r of surabayaRooms) {
    await prisma.room.create({
      data: {
        propertyId: propSurabaya.id,
        roomNumber: r.number,
        roomName: r.name,
        slug: `surabaya-${r.number.toLowerCase()}`,
        description: `Kamar ${r.name} di Kost Eksklusif Surabaya dengan fasilitas modern untuk kenyamanan Anda.`,
        maxGuests: r.guests,
        roomSize: r.size,
        bedType: r.bed,
        amenities: r.amenities,
        photos: placeholderPhotos,
        thumbnail: "/images/placeholder-room.jpg",
        basePrice: r.dailyPrice,
        monthlyPrice: r.monthlyPrice,
      }
    });
  }
  console.log(`🛏️ Seeded 6 Surabaya Rooms`);

  // BATU (3 Rooms/Options)
  const batuRooms = [
    {
      number: "L1",
      name: "Villa Lantai 1",
      size: "150m²",
      guests: 6,
      price: 1500000,
      bed: "3 King Beds",
      description: "3 Kamar Tidur, 2 Kamar Mandi, Ruang Tamu, Dapur, Teras. Sangat cocok untuk keluarga medium.",
      amenities: ["3 Kamar Tidur", "2 Kamar Mandi", "Ruang Tamu Besar", "Dapur Lengkap", "TV 50\"", "WiFi", "Parkir 2 Mobil", "Teras View Gunung"]
    },
    {
      number: "L2",
      name: "Villa Lantai 2",
      size: "150m²",
      guests: 6,
      price: 1500000,
      bed: "3 King Beds",
      description: "3 Kamar Tidur, 2 Kamar Mandi, Ruang Keluarga, Dapur, Balkon. View yang sangat indah dari lantai atas.",
      amenities: ["3 Kamar Tidur", "2 Kamar Mandi", "Ruang Keluarga", "Dapur Lengkap", "Smart TV", "WiFi", "Balkon View Gunung", "BBQ Area"]
    },
    {
      number: "FULL",
      name: "Full Villa (L1+L2)",
      size: "300m²",
      guests: 12,
      price: 2800000,
      bed: "6 King Beds",
      description: "Seluruh Villa 2 Lantai, 6 Kamar Tidur, 4 Kamar Mandi, Full Fasilitas. Menampung rombongan besar secara privat.",
      amenities: ["6 Kamar Tidur", "4 Kamar Mandi", "2 Ruang Tamu", "2 Dapur", "Rooftop", "Private Pool", "Parkir 4 Mobil", "Full Privacy"]
    }
  ];

  for (const r of batuRooms) {
    await prisma.room.create({
      data: {
        propertyId: propBatu.id,
        roomNumber: r.number,
        roomName: r.name,
        slug: `batu-${r.number.toLowerCase()}`,
        description: r.description,
        maxGuests: r.guests,
        roomSize: r.size,
        bedType: r.bed,
        amenities: r.amenities,
        photos: placeholderPhotos,
        thumbnail: "/images/placeholder-room.jpg",
        basePrice: r.price,
      }
    });
  }
  console.log(`🛏️ Seeded 3 Batu Villa Options`);

  console.log('✅ Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
