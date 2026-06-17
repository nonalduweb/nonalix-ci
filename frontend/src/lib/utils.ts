// Utility functions
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Slugify text for URLs
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Validate Ivorian phone number (10 digits, starts with 0)
export function isValidIvorianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  return /^0[157]\d{8}$/.test(cleaned);
}

// Format phone for display: 07 06 90 69 30
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) return phone;
  return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
}

// Format phone for WhatsApp link (international format)
export function formatPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return '225' + cleaned.substring(1);
  }
  return cleaned;
}
