import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPhoneForWA = (phone: string): string => {
  // 081231646523 → 6281231646523
  if (phone.startsWith('0')) {
    return '62' + phone.substring(1);
  }
  return phone.replace(/[^0-9]/g, '');
};

export const generateWALink = (phone: string, message?: string): string => {
  const formatted = formatPhoneForWA(phone);
  const base = `https://wa.me/${formatted}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
};

// Default message templates
export const WA_TEMPLATES = {
  general: "Halo Admin Alvira, saya ingin bertanya tentang...",
  booking: (roomName: string) => `Halo, saya ingin booking ${roomName}...`,
  contact: "Halo, saya menghubungi dari website Alvira..."
};
