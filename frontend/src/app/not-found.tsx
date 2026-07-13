import Link from 'next/link';
import { GridBackground } from '@/components/ui/GridBackground';

export const metadata = {
  title: 'Page introuvable (404) | NONALIX CI',
  description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#050505',
      color: '#fafafa',
      fontFamily: 'var(--font-heading)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <GridBackground />
      
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1.5rem',
        padding: '3rem 2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 40px rgba(231, 173, 5, 0.05)'
      }}>
        {/* 404 Large Indicator */}
        <div style={{
          fontSize: '6rem',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #e7ad05 0%, #ff6600 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: '1rem',
          letterSpacing: '-2px'
        }}>
          404
        </div>
        
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '1rem',
          color: '#fafafa'
        }}>
          Page Introuvable
        </h1>
        
        <p style={{
          color: '#a1a1aa',
          fontSize: '0.9375rem',
          lineHeight: 1.6,
          marginBottom: '2.5rem'
        }}>
          Désolé, la page que vous essayez de consulter n&apos;existe pas, a été renommée ou est temporairement indisponible.
        </p>
        
        {/* Navigation Action Button */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#e7ad05',
            color: '#000',
            fontWeight: 700,
            fontSize: '0.875rem',
            padding: '0.75rem 1.75rem',
            borderRadius: '9999px',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(231, 173, 5, 0.2)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
        >
          ↩️ Retourner à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
