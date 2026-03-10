"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, MapPin, ChevronDown, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

// Reusable animated container
const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function ContactPage() {
    const [activeTab, setActiveTab] = useState("sidoarjo");
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const faqs = [
        {
            q: "Bagaimana cara booking kamar?",
            a: "Anda dapat melakukan booking melalui tombol WhatsApp yang tersedia di setiap halaman properti. Admin kami akan segera merespon untuk konfirmasi ketersediaan dan metode pembayaran."
        },
        {
            q: "Apakah bisa check-in lebih awal (early check-in)?",
            a: "Early check-in tergantung pada ketersediaan kamar di hari tersebut. Silakan hubungi admin kami maksimal 1 hari sebelum kedatangan untuk memastikan ketersediaan."
        },
        {
            q: "Kebijakan pembatalan (cancellation policy) seperti apa?",
            a: "Pembatalan gratis dapat dilakukan maksimal 48 jam sebelum waktu check-in. Pembatalan dalam waktu 48 jam akan dikenakan biaya 50% dari total tagihan malam pertama."
        },
        {
            q: "Apakah tersedia parkir untuk mobil?",
            a: "Ya, kami menyediakan area parkir gratis untuk tamu. Kapasitas bervariasi tergantung properti (Sidoarjo, Surabaya, atau Villa Batu)."
        },
        {
            q: "Apakah diperbolehkan membawa hewan peliharaan?",
            a: "Mohon maaf, demi kenyamanan seluruh tamu dan kebersihan properti, kami tidak mengizinkan hewan peliharaan di seluruh cabang Alvira Homestay."
        }
    ];

    const locations = {
        sidoarjo: {
            name: "Alvira Homestay Sidoarjo",
            address: "Pusat Kota Sidoarjo, Jawa Timur",
            landmark: "Dekat dengan Alun-alun Sidoarjo dan Stasiun Kota.",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126442.23847551066!2d112.6394!3d-7.4478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjYnNTIuMSJTIDExMsKwMzgnMjEuOCJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid" // Placeholder embedded map
        },
        surabaya: {
            name: "Kost Eksklusif Surabaya",
            address: "Pusat Kota Pahlawan, Surabaya, Jawa Timur",
            landmark: "Strategis dekat dengan Tunjungan Plaza dan perkantoran.",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126646.20967597148!2d112.6713437!3d-7.2756141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMTYnMzIuMiJTIDExMsKwNDAnMTYuOCJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
        },
        batu: {
            name: "Villa Premium Batu",
            address: "Kawasan Pegunungan Batu, Malang Raya, Jawa Timur",
            landmark: "5 menit dari Jatim Park dan Museum Angkut.",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.812379532549!2d112.5204432!3d-7.8727283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNTInMjEuOCJTIDExMsKwMzEnMTMuNiJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* 1. Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-primary text-primary-foreground">
                <div className="absolute inset-0 bg-[url('/images/properties/sidoarjo-hero.jpg')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent z-10"></div>
                <div className="container relative z-20 mx-auto px-4 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-block py-1 px-3 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-4 border border-secondary/30"
                    >
                        HUBUNGI KAMI
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight"
                    >
                        Kami Siap Membantu Anda <span className="text-secondary">24/7</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-10"
                    >
                        Punya pertanyaan mengenai booking, fasilitas, atau kerjasama? Jangan ragu untuk menghubungi tim profesional kami. Respon cepat via WhatsApp!
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <a href="https://wa.me/6281231646523" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-lg h-12 px-8 font-semibold bg-[#25D366] text-white hover:bg-[#128C7E] shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105">
                            <MessageCircle className="w-5 h-5 mr-2" /> Chat WhatsApp Sekarang
                        </a>
                        <a href="#lokasi" className="inline-flex items-center justify-center rounded-lg h-12 px-8 font-semibold bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition-colors">
                            <MapPin className="w-5 h-5 mr-2" /> Lihat Peta Lokasi
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* 2. Info Kontak Cards */}
            <section className="py-16 -mt-10 relative z-30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {/* Phone */}
                        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="bg-card border rounded-2xl p-8 shadow-xl shadow-black/5 text-center flex flex-col items-center hover:-translate-y-1 transition-transform">
                            <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                                <Phone className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif font-bold text-xl mb-2 text-foreground">Telepon</h3>
                            <p className="text-muted-foreground mb-1">0812-3164-6523</p>
                            <p className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-6">Online 24 Jam</p>
                            <a href="tel:081231646523" className="mt-auto w-full py-2.5 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                                Call Now
                            </a>
                        </motion.div>

                        {/* WA */}
                        <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="bg-card border-2 border-primary rounded-2xl p-8 shadow-2xl shadow-primary/10 text-center flex flex-col items-center hover:-translate-y-1 transition-transform relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">Fast Response</div>
                            <div className="w-14 h-14 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mb-6">
                                <MessageCircle className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif font-bold text-xl mb-2 text-foreground">WhatsApp</h3>
                            <p className="text-muted-foreground mb-1">0812-3164-6523</p>
                            <p className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-6">Paling Disarankan</p>
                            <a href="https://wa.me/6281231646523" target="_blank" rel="noopener noreferrer" className="mt-auto w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                Chat Now
                            </a>
                        </motion.div>

                        {/* Email */}
                        <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="bg-card border rounded-2xl p-8 shadow-xl shadow-black/5 text-center flex flex-col items-center hover:-translate-y-1 transition-transform">
                            <div className="w-14 h-14 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center mb-6">
                                <Mail className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif font-bold text-xl mb-2 text-foreground">Email</h3>
                            <p className="text-muted-foreground mb-1">halo@alvira.id</p>
                            <p className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full mb-6">Kerjasama & Info</p>
                            <a href="mailto:halo@alvira.id" className="mt-auto w-full py-2.5 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors">
                                Send Email
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Social Media Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-12">
                        <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Ikuti Perjalanan Kami</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">Dapatkan promo terbaru, review jujur, dan intip kamar-kamar estetik kami langsung dari sosial media.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {/* TikTok */}
                        <motion.a
                            href="https://tiktok.com/@alvira_stay" target="_blank" rel="noopener noreferrer"
                            className="group relative overflow-hidden rounded-2xl bg-black p-8 text-white text-left flex flex-col items-start hover:-translate-y-2 transition-all duration-300 shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-black to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <svg className="w-10 h-10 mb-6 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                            <h4 className="text-xl font-bold mb-1 relative z-10">TikTok</h4>
                            <p className="text-gray-400 mb-8 relative z-10">@alvira_stay</p>
                            <span className="mt-auto px-4 py-2 bg-white/10 rounded-full text-sm font-semibold backdrop-blur-md group-hover:bg-white group-hover:text-black transition-colors relative z-10">Follow Us</span>
                        </motion.a>

                        {/* Instagram */}
                        <motion.a
                            href="https://instagram.com/alvira.homestay" target="_blank" rel="noopener noreferrer"
                            className="group relative overflow-hidden rounded-2xl p-8 text-white text-left flex flex-col items-start hover:-translate-y-2 transition-all duration-300 shadow-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]"
                        >
                            <svg className="w-10 h-10 mb-6 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            <h4 className="text-xl font-bold mb-1 relative z-10">Instagram</h4>
                            <p className="text-white/80 mb-8 relative z-10">@alvira.homestay</p>
                            <span className="mt-auto px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-md hover:bg-white hover:text-[#bc1888] transition-colors relative z-10">Follow Us</span>
                        </motion.a>

                        {/* YouTube */}
                        <motion.a
                            href="https://youtube.com/@alvirahomestay" target="_blank" rel="noopener noreferrer"
                            className="group relative overflow-hidden rounded-2xl bg-[#FF0000] p-8 text-white text-left flex flex-col items-start hover:-translate-y-2 transition-all duration-300 shadow-xl"
                        >
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <svg className="w-10 h-10 mb-6 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            <h4 className="text-xl font-bold mb-1 relative z-10">YouTube</h4>
                            <p className="text-white/80 mb-8 relative z-10">Alvira Homestay</p>
                            <span className="mt-auto px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-md group-hover:bg-white group-hover:text-[#FF0000] transition-colors relative z-10">Subscribe</span>
                        </motion.a>
                    </div>
                </div>
            </section>

            {/* 4. Lokasi & Maps Section */}
            <section id="lokasi" className="py-20 bg-background border-t">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Lokasi Properti Kami</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">Kami beroperasi di 3 kota besar. Tekan navigasi untuk membuka Google Maps secara langsung.</p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-card border rounded-2xl shadow-lg overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b overflow-x-auto hide-scrollbar">
                            {Object.keys(locations).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`flex-1 min-w-[120px] py-4 px-6 text-sm md:text-base font-semibold transition-colors border-b-2 ${activeTab === key ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        }`}
                                >
                                    {locations[key as keyof typeof locations].name.split(" ")[0] === "Alvira" ? "Sidoarjo" : key.charAt(0).toUpperCase() + key.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="w-full md:w-1/2 space-y-4">
                                    <h3 className="text-2xl font-serif font-bold text-foreground">{locations[activeTab as keyof typeof locations].name}</h3>
                                    <div className="flex items-start gap-3 text-muted-foreground">
                                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <p>{locations[activeTab as keyof typeof locations].address}</p>
                                    </div>
                                    <div className="flex items-start gap-3 text-muted-foreground">
                                        <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                                        <p>{locations[activeTab as keyof typeof locations].landmark}</p>
                                    </div>
                                    <a
                                        href={locations[activeTab as keyof typeof locations].mapUrl}
                                        target="_blank" rel="noopener noreferrer"
                                        className="inline-flex mt-4 items-center justify-center rounded-lg h-11 px-6 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full md:w-auto"
                                    >
                                        Mulai Navigasi
                                    </a>
                                </div>
                                <div className="w-full md:w-1/2 h-64 md:h-80 rounded-xl overflow-hidden bg-muted border relative">
                                    <iframe
                                        src={locations[activeTab as keyof typeof locations].mapUrl}
                                        className="absolute inset-0 w-full h-full border-0"
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={`Peta lokasi ${activeTab}`}
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FAQ Accordion */}
            <section className="py-20 bg-muted/30 border-t">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Pertanyaan Populer (FAQ)</h2>
                        <p className="text-muted-foreground">Temukan jawaban atas pertanyaan yang paling sering diajukan pelanggan kami.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-card border rounded-xl overflow-hidden shadow-sm">
                                <button
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                >
                                    <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                                    <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`} />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                                >
                                    <p className="p-6 pt-0 text-muted-foreground leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <p className="text-muted-foreground mb-4">Tidak menemukan jawaban Anda?</p>
                        <a href="https://wa.me/6281231646523" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary font-semibold hover:underline">
                            Tanyakan via WhatsApp <MessageCircle className="w-4 h-4 ml-2" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
