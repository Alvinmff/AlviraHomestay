1. OVERVIEW
1.1 Product Vision
Homestay Alvira adalah platform pemesanan akomodasi terpadu yang menyatukan tiga properti unggulan di lokasi strategis Jawa Timur (Sidoarjo, Surabaya, dan Batu) dalam satu website yang elegan dan user-friendly.
1.2 Business Objectives
Menyatukan brand homestay yang tersebar di 3 kota dalam satu platform digital
Meningkatkan kredibilitas brand melalui tampilan website yang mewah dan profesional
Memudahkan calon tamu menemukan dan memesan akomodasi sesuai kebutuhan
Mengurangi beban admin dalam mengelola pemesanan manual
Menyediakan informasi real-time mengenai ketersediaan kamar
1.3 Target Audience
Primary: Wisatawan domestik yang mencari akomodasi di Sidoarjo, Surabaya, atau Batu
Secondary: Business travelers, keluarga besar (untuk villa Batu), dan mahasiswa/pekerja (untuk kost Surabaya)
Demografi: Usia 20-50 tahun, middle-to-upper class, tech-savvy
1.4 Unique Value Proposition
"Tiga kota, satu kenyamanan. Pengalaman menginap premium dengan pilihan akomodasi beragam—dari homestay cozy di Sidoarjo, kost eksklusif di Surabaya, hingga villa mewah di Batu—semua dalam genggaman Anda."
2. REQUIREMENTS
2.1 Functional Requirements
FR-001: Multi-Property Management
Sistem harus mendukung 3 lokasi properti dengan karakteristik berbeda
Setiap properti memiliki galeri foto, deskripsi, fasilitas, dan harga tersendiri
FR-002: Real-time Availability
Dashboard admin untuk update status ketersediaan kamar real-time
Penandaan visual untuk kamar yang tersedia, dipesan, atau sedang maintenance
FR-003: WhatsApp Integration
Tombol "Pesan via WhatsApp" yang mengarahkan ke admin dengan detail pemesanan otomatis
Template pesan yang sudah terisi data pemesanan (tanggal, tipe kamar, durasi)
FR-004: Flexible Booking System
Sidoarjo: Pemesanan per kamar (7 kamar tersedia)
Surabaya: Pemesanan per kamar kost (6 kamar tersedia)
Batu: Pemesanan per lantai atau full villa (2 lantai)
FR-005: Payment Options
Transfer Bank (Virtual Account/Transfer Manual)
E-Wallet (OVO, GoPay, DANA, LinkAja)
Bayar di Tempat (Cash on Arrival)
FR-006: User Account (Opsional)
Registrasi dan login opsional untuk user
Riwayat pemesanan untuk user yang memiliki akun
Guest checkout tetap tersedia
FR-007: Content Management
Galeri foto untuk setiap properti dan kamar
Peta lokasi interaktif (Google Maps integration)
Sistem testimoni dan rating dari tamu
2.2 Non-Functional Requirements
Table
Aspek	Requirement
Performance	Load time < 3 detik, 99.9% uptime
Security	SSL Certificate, data encryption, secure payment gateway
Scalability	Arsitektur yang mendukung penambahan properti baru
SEO	Optimasi untuk pencarian "homestay sidoarjo", "villa batu", "kost surabaya"
Responsive	Mobile-first design, optimal di semua device
Accessibility	WCAG 2.1 Level AA compliance
3. CORE FEATURES
3.1 MVP Features (Version 1.0) - PRIORITAS TINGGI
🔥 Fitur Prioritas Utama:
Table
No	Fitur	Deskripsi	Priority
1	Galeri Foto	High-quality image gallery untuk setiap properti dan kamar, dengan lightbox view	P0
2	Peta Lokasi	Google Maps integration dengan marker untuk masing-masing lokasi	P0
3	Ketersediaan Real-time	Status kamar yang terupdate langsung dari dashboard admin	P0
4	Testimoni User	Sistem review dan rating tamu yang pernah menginap	P0
Fitur Pendukung MVP:
Table
No	Fitur	Deskripsi
5	Multi-Property Catalog	Halaman listing ketiga lokasi dengan filter kota
6	Detail Properti	Informasi lengkap fasilitas, harga, dan kebijakan
7	WhatsApp Booking	Integrasi WA untuk konfirmasi pemesanan
8	Admin Dashboard	Panel untuk mengelola ketersediaan dan konten
3.2 Future Enhancements (Version 2.0+)
Online payment gateway terintegrasi (Midtrans/Xendit)
Sistem voucher dan promo code
Loyalty program untuk repeat customers
Multi-language support (English/Indonesia)
Mobile application (Android/iOS)
Channel manager untuk integrasi OTA (Traveloka, Tiket.com, dll)
4. USER FLOW
4.1 User Journey Map
plain
Copy
┌─────────────────────────────────────────────────────────────────┐
│                     DISCOVER (Menemukan)                        │
│  Google Search → Landing Page → Lihat Katalog Kota → Pilih      │
│  Properti → Lihat Detail → Cek Ketersediaan                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     CONSIDER (Pertimbangan)                     │
│  Lihat Galeri Foto → Baca Testimoni → Cek Peta Lokasi →         │
│  Bandingkan Harga → Pilih Tipe Kamar/Villa                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     BOOK (Pemesanan)                            │
│  Pilih Tanggal → Isi Data Diri (Guest/Login) → Pilih Metode     │
│  Pembayaran → Konfirmasi via WhatsApp → Terima Detail Pemesanan │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     EXPERIENCE (Pengalaman)                     │
│  Check-in → Menginap → Check-out → Terima Request Review        │
└─────────────────────────────────────────────────────────────────┘
4.2 Detailed User Flow
A. Flow Pemesanan Kamar (Sidoarjo & Surabaya)
Mermaid
Copy
Code
Preview
User Landing → Pilih Kota → Pilih Properti → Lihat Detail 
    ↓
Pilih Tipe Kamar → Cek Kalender Ketersediaan → Klik "Pesan"
    ↓
[Opsi A: Guest] / [Opsi B: Login User]
    ↓
Isi Form Data (Nama, No HP, Email, Catatan)
    ↓
Pilih Metode Pembayaran (Transfer/E-Wallet/COD)
    ↓
Review Ringkasan Pemesanan
    ↓
Klik "Konfirmasi via WhatsApp"
    ↓
Redirect ke WhatsApp Admin (Auto-fill detail pesanan)
    ↓
Admin Konfirmasi Ketersediaan & Pembayaran
    ↓
Update Status Kamar di Dashboard (Booked)
    ↓
User Menerima Konfirmasi Booking
B. Flow Pemesanan Villa Batu (Per Lantai/Full)
Mermaid
Copy
Code
Preview
User Pilih "Villa Batu" → Pilih Mode Sewa:
    ├─→ Sewa Lantai 1 (3 Kamar + Fasilitas)
    ├─→ Sewa Lantai 2 (3 Kamar + Fasilitas)
    └─→ Sewa Full Villa (6 Kamar + All Fasilitas)
            ↓
Cek Ketersediaan Tanggal → Isi Data Penyewa
            ↓
Pilih Metode Pembayaran (DP/Full Payment/COD)
            ↓
Konfirmasi via WhatsApp → Proses serupa flow kamar
C. Flow Admin Update Ketersediaan
Mermaid
Copy
Code
Preview
Admin Login Dashboard → Pilih Properti (Sidoarjo/Surabaya/Batu)
    ↓
Lihat Grid Kamar/Villa → Klik Kamar Spesifik
    ↓
Update Status:
    ├─ Tersedia (Available)
    ├─ Dipesan (Booked)
    ├─ Check-in (Occupied)
    ├─ Maintenance
    └─ Diblokir (Blocked)
    ↓
Simpan → Auto-update di Website Frontend
5. ARCHITECTURE
5.1 System Architecture
plain
Copy
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web App    │  │  Mobile Web  │  │   WhatsApp   │      │
│  │  (Next.js)   │  │ (Responsive) │  │   (API WA)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY / BFF                      │
│         (Authentication, Rate Limiting, Routing)            │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌─────────────────┐    ┌──────────────┐
│  PROPERTY    │    │  BOOKING        │    │  CONTENT     │
│  SERVICE     │    │  SERVICE        │    │  SERVICE     │
│  (Node.js)   │    │  (Node.js)      │    │  (Node.js)   │
└──────────────┘    └─────────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │     Redis    │  │  Cloudinary  │      │
│  │  (Primary DB)│  │   (Cache)    │  │   (Images)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   THIRD PARTY SERVICES                      │
│  Google Maps API │ WhatsApp Business API │ Payment Gateway  │
└─────────────────────────────────────────────────────────────┘
5.2 Technology Stack
Table
Layer	Teknologi	Justifikasi
Frontend	Next.js 14 (App Router)	SEO-friendly, SSR, optimal performance
Styling	Tailwind CSS + Framer Motion	Rapid development, animasi halus
Backend	Node.js + Express / Next.js API	Full-stack JavaScript, efisien
Database	PostgreSQL	Relational data kompleks (booking, kamar)
ORM	Prisma	Type-safe database queries
Auth	NextAuth.js	Autentikasi fleksibel (opsional login)
Storage	Cloudinary	Optimasi gambar otomatis
Cache	Redis	Real-time availability caching
Hosting	Vercel (Frontend) + Railway/Supabase (DB)	Cost-effective, scalable
6. DATABASE SCHEMA
6.1 Entity Relationship Diagram
plain
Copy
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     USERS       │       │   PROPERTIES    │       │     ROOMS       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ email           │◄──────┤ name            │◄──────┤ property_id(FK) │
│ password_hash   │       │ slug            │       │ name            │
│ full_name       │       │ location_type   │       │ room_type       │
│ phone           │       │ address         │       │ floor_number    │
│ avatar_url      │       │ city            │       │ capacity        │
│ created_at      │       │ description     │       │ price_per_night │
└─────────────────┘       │ facilities[]    │       │ amenities[]     │
                          │ latitude        │       │ photos[]        │
                          │ longitude       │       │ is_active       │
                          │ thumbnail       │       │ created_at      │
                          │ is_active       │       └─────────────────┘
                          └─────────────────┘              │
                                    │                      │
                                    │              ┌───────┘
                                    │              │
                                    ▼              ▼
                          ┌─────────────────┐       ┌─────────────────┐
                          │  ROOM_AVAILABILITY      │    BOOKINGS     │
                          ├─────────────────┤       ├─────────────────┤
                          │ id (PK)         │       │ id (PK)         │
                          │ room_id (FK)    │◄──────┤ room_id (FK)    │
                          │ date            │       │ user_id (FK)    │◄── Nullable
                          │ status          │       │ guest_name      │
                          │ booking_id (FK) │◄──────┤ guest_phone     │
                          │ updated_at      │       │ guest_email     │
                          └─────────────────┘       │ check_in_date   │
                                                    │ check_out_date  │
                                                    │ total_price     │
                                                    │ payment_method  │
                                                    │ payment_status  │
                                                    │ booking_status  │
                                                    │ whatsapp_msg_id │
                                                    │ created_at      │
                                                    └─────────────────┘
                                                            │
                                                    ┌───────┘
                                                    │
                                                    ▼
                                            ┌─────────────────┐
                                            │    REVIEWS      │
                                            ├─────────────────┤
                                            │ id (PK)         │
                                            │ booking_id (FK) │
                                            │ rating          │
                                            │ comment         │
                                            │ photos[]        │
                                            │ is_published    │
                                            │ created_at      │
                                            └─────────────────┘
6.2 Schema Detail
Table: properties
sql
Copy
- id: UUID (PK)
- name: VARCHAR (e.g., "Alvira Homestay Sidoarjo")
- slug: VARCHAR (unique, e.g., "sidoarjo")
- type: ENUM ('homestay', 'kost', 'villa')
- city: ENUM ('sidoarjo', 'surabaya', 'batu')
- address: TEXT
- description: TEXT
- facilities: JSONB (["WiFi", "AC", "Parkir", "Dapur"])
- latitude: DECIMAL(10,8)
- longitude: DECIMAL(11,8)
- thumbnail_url: VARCHAR
- gallery_urls: JSONB
- is_active: BOOLEAN
- created_at: TIMESTAMP
Table: rooms
sql
Copy
- id: UUID (PK)
- property_id: UUID (FK)
- name: VARCHAR (e.g., "Kamar Deluxe 101", "Lantai 1 Villa")
- room_code: VARCHAR (e.g., "SDJ-01", "BT-L1")
- type: ENUM ('single', 'double', 'family', 'floor', 'full_villa')
- floor_number: INT (untuk villa batu: 1, 2, atau 0 untuk full)
- max_guests: INT
- base_price: DECIMAL(10,2) (per malam)
- weekend_price: DECIMAL(10,2) (opsional)
- description: TEXT
- amenities: JSONB
- photos: JSONB
- is_active: BOOLEAN
Table: room_availability (Critical for Real-time)
sql
Copy
- id: UUID (PK)
- room_id: UUID (FK)
- date: DATE
- status: ENUM ('available', 'booked', 'maintenance', 'blocked')
- booking_id: UUID (FK, nullable)
- updated_by: UUID (admin id)
- updated_at: TIMESTAMP
- UNIQUE(room_id, date)
Table: bookings
sql
Copy
- id: UUID (PK)
- booking_code: VARCHAR (unique, e.g., "ALV-20240309-001")
- room_id: UUID (FK)
- user_id: UUID (FK, nullable - untuk guest checkout)
- guest_name: VARCHAR
- guest_phone: VARCHAR (format WhatsApp: 628...)
- guest_email: VARCHAR
- check_in: DATE
- check_out: DATE
- total_nights: INT
- total_price: DECIMAL(10,2)
- payment_method: ENUM ('bank_transfer', 'e_wallet', 'cash')
- payment_status: ENUM ('pending', 'paid', 'failed', 'refunded')
- booking_status: ENUM ('inquiry', 'confirmed', 'checked_in', 'completed', 'cancelled')
- whatsapp_conversation_id: VARCHAR
- special_requests: TEXT
- created_at: TIMESTAMP
7. DESIGN & TECHNICAL CONSTRAINTS
7.1 Design System
A. Color Palette - "Mewah & Asri"
Table
Role	Color	Hex	Usage
Primary	Deep Forest Green	#1B4D3E	Header, CTA buttons, brand identity
Primary Light	Sage Green	#7A9E7E	Hover states, accents
Secondary	Warm Gold	#C9A227	Premium highlights, icons, ratings
Secondary Light	Champagne	#F4E4C1	Background accents, badges
Neutral Dark	Charcoal	#2C2C2C	Text utama
Neutral	Warm Gray	#6B6B6B	Text sekunder
Neutral Light	Off-White	#FAF9F6	Background utama
Accent	Terracotta	#D4754E	Urgency, promo tags
Success	Emerald	#059669	Available status
Warning	Amber	#D97706	Pending status
B. Typography
Table
Element	Font	Weight	Size
Brand/Logo	Playfair Display	700	28px
H1 (Hero)	Playfair Display	700	48px/56px
H2 (Section)	Playfair Display	600	32px
H3 (Card Title)	Inter	600	20px
Body	Inter	400	16px
Caption	Inter	400	14px
Button	Inter	600	14px
C. Visual Style Guidelines
Imagery: Foto high-resolution, warm tones, natural lighting, sudut pandang eye-level
Shadows: Soft shadows (0 4px 20px rgba(0,0,0,0.08)) untuk kedalaman elegan
Border Radius: 12px untuk cards, 8px untuk buttons, 16px untuk modal
Spacing: 8px base grid, generous whitespace (luxury feel)
Icons: Phosphor Icons atau Lucide (stroke width 1.5-2)
Animations: Subtle fade-in, smooth transitions (300ms ease-out)
7.2 Technical Constraints
A. Infrastructure Constraints
Table
Constraint	Detail
Budget	Optimasi untuk hosting cost-effective (Vercel Hobby/Pro)
Domain	Gunakan domain custom: alvirahomestay.com
SSL	Wajib HTTPS untuk semua halaman
CDN	Gunakan Cloudflare/Vercel Edge Network
B. Integration Constraints
Table
Sistem	Constraint
WhatsApp	Gunakan WhatsApp Business API atau wa.me link (gratis) dengan template pesan
Maps	Google Maps JavaScript API dengan billing alerts
Payment	V1: Manual konfirmasi, V2: Integrasi Midtrans/Xendit
Images	Optimasi otomatis via Cloudinary, max 2MB per image
C. Security Constraints
Validasi input strict pada form pemesanan
Rate limiting pada endpoint booking (prevent spam)
Sanitasi data sebelum ditampilkan (XSS protection)
Hashing password dengan bcrypt (jika user login)
Environment variables untuk API keys
D. Performance Constraints
First Contentful Paint < 1.5s
Largest Contentful Paint < 2.5s
Image optimization: WebP format, lazy loading
Database query optimization dengan indexing
Redis caching untuk data ketersediaan kamar
7.3 Business Logic Constraints
Table
Aspek	Aturan
Booking Window	Min. H-1 untuk booking, max. 3 bulan ke depan
Check-in/out	Check-in 14:00, Check-out 12:00
Villa Batu	Jika Lantai 1 booked, Lantai 2 masih bisa. Full villa hanya jika keduanya available
Cancelation	Free cancelation H-3, 50% refund H-1
Payment Time Limit	Transfer: 2 jam, E-Wallet: 30 menit
