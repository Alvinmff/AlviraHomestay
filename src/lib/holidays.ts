import { format } from "date-fns";

// Daftar tanggal merah (Hari Libur Nasional Indonesia)
// Format: YYYY-MM-DD
// Catatan: Ini adalah estimasi untuk tahun 2026 dan 2027.
export const PUBLIC_HOLIDAYS = [
  "2026-01-01", // Tahun Baru Masehi
  "2026-02-17", // Isra Mikraj Nabi Muhammad SAW
  "2026-03-03", // Hari Suci Nyepi
  "2026-03-20", // Wafat Yesus Kristus
  "2026-03-21", // Hari Raya Idul Fitri 1447 H (Estimasi)
  "2026-03-22", // Hari Raya Idul Fitri 1447 H (Estimasi)
  "2026-05-01", // Hari Buruh Internasional
  "2026-05-14", // Kenaikan Yesus Kristus
  "2026-05-28", // Hari Raya Waisak
  "2026-06-01", // Hari Lahir Pancasila
  "2026-06-28", // Hari Raya Idul Adha 1447 H (Estimasi)
  "2026-07-19", // Tahun Baru Islam 1448 H (Estimasi)
  "2026-08-17", // Hari Kemerdekaan RI
  "2026-09-27", // Maulid Nabi Muhammad SAW (Estimasi)
  "2026-12-25", // Hari Raya Natal

  "2027-01-01", // Tahun Baru Masehi
  // Tambahkan daftar hari libur resmi berikutnya di sini
];

/**
 * Mengecek apakah suatu tanggal adalah hari libur (Sabtu, Minggu, atau Tanggal Merah)
 * Hari Jumat (5), Sabtu (6), Minggu (0) dianggap weekend di sistem ini berdasarkan kebutuhan user.
 */
export function isWeekendOrHoliday(date: Date): boolean {
  const day = date.getDay();
  // Jumat = 5, Sabtu = 6, Minggu = 0
  if (day === 0 || day === 5 || day === 6) {
    return true;
  }

  const formattedDate = format(date, "yyyy-MM-dd");
  return PUBLIC_HOLIDAYS.includes(formattedDate);
}
