'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { FileSpreadsheet, FileText, Receipt } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// ─── Tipe Data ───
interface ExportRoom {
  roomName: string;
  roomNumber: string;
  roomId: string;
  totalPrice: number;
}

interface ExportBooking {
  id: string;
  groupId: string | null;
  guestName: string;
  guestPhone: string | null;
  guestCount: number;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  dpAmount: number | null;
  status: string;
  property: { name: string; city: string };
  roomNames: string;
  rooms: ExportRoom[];
  notes: string | null;
  identityType?: string | null;
  identityNumber?: string | null;
  identityImage?: string | null;
}

// ─── Helper Format ───
const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n);

const formatDate = (d: Date | string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(d));

const statusMap: Record<string, string> = {
  CONFIRMED: 'Booking',
  CHECKED_IN: 'Check-in',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

const statusColor = (s: string) => {
  switch (s) {
    case 'CONFIRMED': return '#10B981';
    case 'CHECKED_IN': return '#3B82F6';
    case 'COMPLETED': return '#64748B';
    case 'CANCELLED': return '#EF4444';
    default: return '#F59E0B';
  }
};

// ─── Logo Loader ───
const useLogo = () => {
  const [logo, setLogo] = useState<string | null>(null);
  useEffect(() => {
    // Changed path based on user feedback
    fetch('/uploads/logo.png')
      .then((r) => (r.ok ? r.blob() : Promise.reject()))
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => setLogo(reader.result as string);
        reader.readAsDataURL(blob);
      })
      .catch(() => setLogo(null));
  }, []);
  return logo;
};

// ─── Grouping by Month ───
const groupByMonth = (bookings: ExportBooking[]) => {
  return bookings.reduce((acc, b) => {
    const key = new Date(b.checkIn).toLocaleString('id-ID', {
      month: 'long',
      year: 'numeric',
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {} as Record<string, ExportBooking[]>);
};

export function BookingExportButtons({ bookings }: { bookings: ExportBooking[] }) {
  const logo = useLogo();
  
  // Get unique properties for filtering
  const uniqueProperties = Array.from(new Set(bookings.map((b) => b.property.name))).sort();

  // ═══════════════════════════════════════════
  // EXCEL
  // ═══════════════════════════════════════════
  const generateExcel = () => {
    const rows = bookings.map((b, i) => ({
      No: i + 1,
      Nama: b.guestName,
      HP: b.guestPhone || '-',
      Tamu: b.guestCount,
      Properti: b.property.name,
      Kamar: b.roomNames,
      CheckIn: formatDate(b.checkIn),
      CheckOut: formatDate(b.checkOut),
      Total: b.totalPrice,
      DP: b.dpAmount || 0,
      'Sisa Bayar': Math.max(0, b.totalPrice - (b.dpAmount || 0)),
      Status: statusMap[b.status] || b.status,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Booking');
    XLSX.writeFile(wb, `laporan_booking_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ═══════════════════════════════════════════
  // PDF (Full & Public)
  // ═══════════════════════════════════════════
  const generatePDF = (type: 'full' | 'public', propertyFilter?: string) => {
    const filteredBookings = propertyFilter 
      ? bookings.filter((b) => b.property.name === propertyFilter)
      : bookings;

    if (filteredBookings.length === 0) return;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const isPublic = type === 'public';

    // Watermark
    (doc as any).saveGraphicsState();
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(45);
    doc.setFont('helvetica', 'bold');
    doc.text('HOMESTAY ALVIRA', pageW / 2, pageH / 2, { align: 'center', baseline: 'middle', angle: 45 });
    (doc as any).restoreGraphicsState();

    // Logo (Sebelah kiri judul)
    if (logo) {
      try {
        doc.addImage(logo, 'PNG', (pageW / 2) - 75, 8, 22, 22);
      } catch { /* ignore */ }
    }

    // Header Text
    doc.setTextColor(27, 94, 32);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    
    const headerTitle = propertyFilter ? propertyFilter.toUpperCase() : 'HOMESTAY ALVIRA';
    doc.text(headerTitle, pageW / 2, 16, { align: 'center' });

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Laporan Booking', pageW / 2, 22, { align: 'center' });
    doc.text(
      'Jl. Raya Lingkar Barat Gading Fajar 2 Blok C5 No 28, Sidoarjo - Jawa Timur',
      pageW / 2,
      27,
      { align: 'center' }
    );

    // Gold line
    doc.setDrawColor(198, 167, 0);
    doc.setLineWidth(0.5);
    doc.line(10, 32, pageW - 10, 32);

    const months = groupByMonth(filteredBookings);
    let startY = 38;

    Object.entries(months).forEach(([monthName, group]) => {
      // Bulan heading
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${monthName.toUpperCase()}`, 10, startY);
      startY += 6;

      const headers = isPublic
        ? ['No', 'Nama', 'Kamar', 'Check In', 'Check Out', 'Status', 'Tamu', 'Properti']
        : ['No', 'Nama', 'HP', 'Kamar', 'Check In', 'Check Out', 'Total', 'DP', 'Sisa', 'Status'];

      const body = group.map((b, idx) => {
        if (isPublic) {
          return [
            idx + 1,
            b.guestName,
            b.roomNames,
            formatDate(b.checkIn),
            formatDate(b.checkOut),
            statusMap[b.status] || b.status,
            b.guestCount,
            b.property.name,
          ];
        }
        return [
          idx + 1,
          b.guestName,
          b.guestPhone || '-',
          b.roomNames,
          formatDate(b.checkIn),
          formatDate(b.checkOut),
          formatRupiah(b.totalPrice),
          b.dpAmount ? formatRupiah(b.dpAmount) : '-',
          b.dpAmount ? formatRupiah(Math.max(0, b.totalPrice - b.dpAmount)) : '-',
          statusMap[b.status] || b.status,
        ];
      });

      autoTable(doc, {
        startY,
        head: [headers],
        body,
        theme: 'grid',
        headStyles: {
          fillColor: [30, 132, 73],
          textColor: 255,
          fontSize: 9,
        },
        styles: { fontSize: 8, cellPadding: 2 },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        didParseCell: (data) => {
          const statusCol = isPublic ? 5 : 9;
          if (data.section === 'body' && data.column.index === statusCol) {
            const status = group[data.row.index]?.status;
            if (status) {
              const hex = statusColor(status);
              const r = parseInt(hex.slice(1, 3), 16);
              const g = parseInt(hex.slice(3, 5), 16);
              const b = parseInt(hex.slice(5, 7), 16);
              data.cell.styles.fillColor = [r, g, b];
              data.cell.styles.textColor = [255, 255, 255];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
      });

      startY = (doc as any).lastAutoTable.finalY + 10;
    });

    // Disclaimer
    doc.setTextColor(192, 57, 43);
    doc.setFontSize(9);
    doc.text('*harga dapat berubah sewaktu-waktu', 10, pageH - 10);

    doc.save(`${type}_booking_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // ═══════════════════════════════════════════
  // PDF WITH IDENTITY PHOTOS
  // ═══════════════════════════════════════════
  const fetchImageAsBase64 = async (url: string): Promise<string | null> => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const generatePDFWithIdentity = async (propertyFilter?: string) => {
    const filteredBookings = propertyFilter
      ? bookings.filter((b) => b.property.name === propertyFilter)
      : bookings;

    if (filteredBookings.length === 0) return;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // ── Page 1+: Standard full report table ──
    // Watermark
    (doc as any).saveGraphicsState();
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(45);
    doc.setFont('helvetica', 'bold');
    doc.text('HOMESTAY ALVIRA', pageW / 2, pageH / 2, { align: 'center', baseline: 'middle', angle: 45 });
    (doc as any).restoreGraphicsState();

    if (logo) {
      try { doc.addImage(logo, 'PNG', (pageW / 2) - 75, 8, 22, 22); } catch { /* ignore */ }
    }

    const headerTitle = propertyFilter ? propertyFilter.toUpperCase() : 'HOMESTAY ALVIRA';
    doc.setTextColor(27, 94, 32);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(headerTitle, pageW / 2, 16, { align: 'center' });
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Laporan Booking + Identitas Tamu', pageW / 2, 22, { align: 'center' });
    doc.text('Jl. Raya Lingkar Barat Gading Fajar 2 Blok C5 No 28, Sidoarjo - Jawa Timur', pageW / 2, 27, { align: 'center' });

    doc.setDrawColor(198, 167, 0);
    doc.setLineWidth(0.5);
    doc.line(10, 32, pageW - 10, 32);

    const months = groupByMonth(filteredBookings);
    let startY = 38;

    Object.entries(months).forEach(([monthName, group]) => {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${monthName.toUpperCase()}`, 10, startY);
      startY += 6;

      const headers = ['No', 'Nama', 'HP', 'Identitas', 'Kamar', 'Check In', 'Check Out', 'Total', 'DP', 'Sisa', 'Status'];
      const body = group.map((b, idx) => [
        idx + 1,
        b.guestName,
        b.guestPhone || '-',
        b.identityType ? `${b.identityType}${b.identityNumber ? ': ' + b.identityNumber : ''}` : '-',
        b.roomNames,
        formatDate(b.checkIn),
        formatDate(b.checkOut),
        formatRupiah(b.totalPrice),
        b.dpAmount ? formatRupiah(b.dpAmount) : '-',
        b.dpAmount ? formatRupiah(Math.max(0, b.totalPrice - b.dpAmount)) : '-',
        statusMap[b.status] || b.status,
      ]);

      autoTable(doc, {
        startY,
        head: [headers],
        body,
        theme: 'grid',
        headStyles: { fillColor: [30, 132, 73], textColor: 255, fontSize: 8 },
        styles: { fontSize: 7, cellPadding: 1.5 },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 10) {
            const status = group[data.row.index]?.status;
            if (status) {
              const hex = statusColor(status);
              const r = parseInt(hex.slice(1, 3), 16);
              const g = parseInt(hex.slice(3, 5), 16);
              const bl = parseInt(hex.slice(5, 7), 16);
              data.cell.styles.fillColor = [r, g, bl];
              data.cell.styles.textColor = [255, 255, 255];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
      });

      startY = (doc as any).lastAutoTable.finalY + 10;
    });

    // ── Appendix: Identity Photo Pages ──
    const bookingsWithIdentity = filteredBookings.filter((b) => b.identityImage);
    if (bookingsWithIdentity.length > 0) {
      doc.addPage();
      const appPageW = doc.internal.pageSize.getWidth();
      const appPageH = doc.internal.pageSize.getHeight();

      // Section Title
      doc.setTextColor(27, 94, 32);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('LAMPIRAN: ARSIP FOTO IDENTITAS TAMU', appPageW / 2, 15, { align: 'center' });
      doc.setDrawColor(198, 167, 0);
      doc.setLineWidth(0.3);
      doc.line(10, 20, appPageW - 10, 20);

      let cardY = 28;
      const cardMargin = 10;
      const imgMaxW = 80;
      const imgMaxH = 50;

      for (const b of bookingsWithIdentity) {
        const imgBase64 = await fetchImageAsBase64(b.identityImage!);

        // Check if we need a new page
        if (cardY + imgMaxH + 20 > appPageH - 15) {
          doc.addPage();
          cardY = 15;
        }

        // Guest info block
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(b.guestName, cardMargin, cardY);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        const infoLine = [
          b.identityType || '',
          b.identityNumber || '',
          `${b.roomNames}`,
          `${formatDate(b.checkIn)} - ${formatDate(b.checkOut)}`,
        ].filter(Boolean).join('  |  ');
        doc.text(infoLine, cardMargin, cardY + 5);

        // Identity image
        if (imgBase64) {
          try {
            doc.addImage(imgBase64, 'JPEG', cardMargin, cardY + 8, imgMaxW, imgMaxH);
          } catch { /* skip broken images */ }
        } else {
          doc.setTextColor(200, 100, 100);
          doc.setFontSize(8);
          doc.text('[Gambar tidak dapat dimuat]', cardMargin, cardY + 20);
        }

        // Separator line
        cardY += imgMaxH + 15;
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.2);
        doc.line(cardMargin, cardY, appPageW - cardMargin, cardY);
        cardY += 7;
      }
    }

    doc.save(`laporan_identitas_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // ═══════════════════════════════════════════
  // INVOICE (per grup)
  // ═══════════════════════════════════════════
  const generateInvoice = (booking: ExportBooking) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    const grandTotal = booking.totalPrice;
    const grandDp = booking.dpAmount || 0;
    const grandSisa = Math.max(0, grandTotal - grandDp);
    const isLunas = grandSisa <= 0;

    // Watermark LUNAS
    if (isLunas) {
      (doc as any).saveGraphicsState();
      doc.setTextColor(255, 200, 200);
      doc.setFontSize(55);
      doc.setFont('helvetica', 'bold');
      doc.text('LUNAS', pageW / 2, pageH / 2, { align: 'center', baseline: 'middle', angle: 30 });
      doc.setFontSize(10);
      doc.setTextColor(200, 100, 100);
      doc.text(`Paid on ${formatDate(new Date())}`, pageW / 2, (pageH / 2) + 15, { align: 'center' });
      doc.text('Terima Kasih', pageW / 2, (pageH / 2) + 22, { align: 'center' });
      (doc as any).restoreGraphicsState();
    }

    // Logo
    if (logo) {
      try {
        doc.addImage(logo, 'PNG', 10, 10, 20, 20);
      } catch { /* ignore */ }
    }

    // Brand
    doc.setTextColor(27, 94, 32);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('HOMESTAY ALVIRA SIDOARJO', 35, 16);
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Jl. Raya Lingkar Barat Gading Fajar 2 Blok C5 No 28', 35, 21);
    doc.text('Sidoarjo - Jawa Timur | Telp: 081231646523', 35, 25);

    // Invoice Meta
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageW - 50, 16);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Invoice #: INV-${new Date().getFullYear()}-${booking.groupId || booking.id.slice(-6)}`,
      pageW - 50,
      22
    );
    doc.text(`Date: ${formatDate(new Date())}`, pageW - 50, 27);

    // Bill To
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Bill To', 10, 45);
    doc.setFont('helvetica', 'normal');
    doc.text(booking.guestName, 10, 51);
    if (booking.guestPhone) doc.text(booking.guestPhone, 10, 56);

    // Table Items
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.max(
      1,
      Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    );

    const body = booking.rooms.map((room) => [
      `${room.roomName} (${room.roomNumber})`,
      formatDate(checkIn),
      formatDate(checkOut),
      nights,
      formatRupiah(room.totalPrice),
    ]);

    autoTable(doc, {
      startY: 65,
      head: [['Kamar', 'Check-in', 'Check-out', 'Nights', 'Amount']],
      body,
      theme: 'grid',
      headStyles: { fillColor: [242, 243, 244], textColor: 0, fontSize: 10 },
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'right' },
      },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 100;

    // Totals
    const rightX = pageW - 20;
    const labelX = pageW - 80;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('TOTAL', labelX, finalY + 10);
    doc.text(formatRupiah(grandTotal), rightX, finalY + 10, { align: 'right' });

    doc.text('DP', labelX, finalY + 18);
    doc.text(formatRupiah(grandDp), rightX, finalY + 18, { align: 'right' });

    doc.setTextColor(200, 50, 50);
    doc.text('SISA', labelX, finalY + 26);
    doc.text(formatRupiah(grandSisa), rightX, finalY + 26, { align: 'right' });

    doc.save(`invoice_${booking.guestName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={generateExcel} className="gap-1.5">
        <FileSpreadsheet className="w-4 h-4" /> Excel
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <FileText className="w-4 h-4" /> PDF
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>📄 Laporan Lengkap</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => generatePDF('full')}>
                  Semua Properti
                </DropdownMenuItem>
                {uniqueProperties.map((prop) => (
                  <DropdownMenuItem key={prop} onClick={() => generatePDF('full', prop)}>
                    {prop}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>📅 Jadwal (Tanpa Harga)</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => generatePDF('public')}>
                  Semua Properti
                </DropdownMenuItem>
                {uniqueProperties.map((prop) => (
                  <DropdownMenuItem key={prop} onClick={() => generatePDF('public', prop)}>
                    {prop}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>🪪 Laporan + Foto Identitas</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => generatePDFWithIdentity()}>
                  Semua Properti
                </DropdownMenuItem>
                {uniqueProperties.map((prop) => (
                  <DropdownMenuItem key={prop} onClick={() => generatePDFWithIdentity(prop)}>
                    {prop}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Receipt className="w-4 h-4" /> Invoice
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
          {bookings.length === 0 && (
            <DropdownMenuItem disabled>Tidak ada data</DropdownMenuItem>
          )}
          {bookings.map((b) => (
            <DropdownMenuItem key={b.id} onClick={() => generateInvoice(b)}>
              <span className="truncate max-w-[200px]">
                {b.guestName} — {b.roomNames}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
