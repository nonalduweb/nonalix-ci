// NONALIX CI — Constantes de configuration

export const SITE_CONFIG = {
  name: 'NONALIX CI',
  fullName: 'NONALIX CI SARL',
  domain: 'nonalix-ci.com',
  description: 'Systèmes d\'automatisation IA, agents conversationnels et croissance digitale pour les entreprises en Afrique et à l\'international',
  tagline: 'Automatisation IA & Croissance Digitale',
} as const;

export const CONTACT_INFO = {
  phone: '+2250566360303',
  phoneDisplay: '+225 05 66 36 03 03',
  email: 'contact@nonalix-ci.com',
  address: 'Abidjan Cocody Angré Pétro Ivoire près de BAOBAB microfinance, Ilot :332, lot :4172',
  whatsappLink: 'https://wa.me/2250566360303?text=Bonjour%20NONALIX%20CI%20!',
} as const;

export const LEGAL_INFO = {
  rccm: 'CI-ABJ-XXXX-X-XXXXX', // À remplacer par le vrai RCCM
  idu: 'CI-XXXX-XXXXXXXX',      // À remplacer par le vrai IDU
  year: new Date().getFullYear(),
} as const;

export const PAYMENT_CONFIG = {
  currency: 'XOF',
  currencyDisplay: 'FCFA',
  simulation: true, // Passer à false quand les clés API marchand sont fournies
} as const;

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/nonalix.ci',
  instagram: 'https://www.instagram.com/nonalix.ci',
  linkedin: 'https://www.linkedin.com/company/nonalix-ci',
  tiktok: 'https://www.tiktok.com/@nonalix.ci',
  googleBusiness: 'https://g.page/r/Ca9830uxPe1xEBI/review',
  googleReviews: 'https://g.page/r/Ca9830uxPe1xEBI/review',
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/audit-seo', label: 'Audit SEO/IA' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/a-propos', label: 'À Propos' },
  { href: '/contact', label: 'Contact' },
] as const;

export const CITIES = [
  'Abidjan - Cocody',
  'Abidjan - Plateau',
  'Abidjan - Marcory',
  'Abidjan - Treichville',
  'Abidjan - Yopougon',
  'Abidjan - Abobo',
  'Abidjan - Adjamé',
  'Abidjan - Koumassi',
  'Abidjan - Port-Bouët',
  'Abidjan - Bingerville',
  'Abidjan - Anyama',
  'Abidjan - Songon',
  'Bouaké',
  'Daloa',
  'Yamoussoukro',
  'San-Pédro',
  'Korhogo',
  'Man',
  'Gagnoa',
  'Abengourou',
  'Autre',
] as const;

// Formatage prix en FCFA
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-CI', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(price) + ' FCFA';
}
