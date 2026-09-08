import type { Config } from 'tailwindcss';

/**
 * Système de design — Cabinet Dentaire
 * ------------------------------------
 * Source de vérité unique pour les couleurs, la typographie, les espacements,
 * les rayons et les ombres. Voir DESIGN.md pour les règles d'usage.
 *
 * Palette : bleus doux (confiance médicale) + beige chaud (chaleur, premium)
 * + gris neutre (texte/UI) + or discret (accent) + couleurs d'état.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    // Conteneur centré, marges responsives cohérentes sur tout le site.
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem'
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1320px'
      }
    },
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#1B2226',
        // — Marque : bleu-sarcelle apaisant (confiance, propreté, médical)
        primary: {
          DEFAULT: '#2E93A9', // couleur de marque principale / CTA
          50: '#EFF9FB',
          100: '#D7F0F4',
          200: '#B2E1E9',
          300: '#82CCD9',
          400: '#4FB0C2',
          500: '#2E93A9', // couleur de marque principale / CTA
          600: '#24788F', // survol / états actifs
          700: '#206173',
          800: '#1F4F5E',
          900: '#1D4350',
          950: '#0F2A33'
        },
        // — Secondaire : sable chaud (chaleur, surfaces douces, premium)
        sand: {
          50: '#FBF9F5',
          100: '#F5EFE4',
          200: '#ECE0CC',
          300: '#DECBAA',
          400: '#CBAF82',
          500: '#BB9765',
          600: '#A67F52',
          700: '#896546',
          800: '#70533D',
          900: '#5D4634'
        },
        // — Neutre : gris légèrement bleuté (texte, bordures, UI admin)
        ink: {
          50: '#F6F8F9',
          100: '#ECF0F2',
          200: '#DCE3E7',
          300: '#C0CBD1',
          400: '#93A2AB',
          500: '#6B7B85',
          600: '#52616A',
          700: '#414D55',
          800: '#2C353B',
          900: '#1B2226'
        },
        // — Accent : or doux (étoiles, détails premium, à utiliser avec parcimonie)
        accent: {
          50: '#FBF6EA',
          100: '#F6EAC9',
          200: '#EDD695',
          300: '#E3C063',
          400: '#D6A93B',
          500: '#C1912A',
          600: '#A2761F',
          700: '#7E5B1B'
        },
        // — États sémantiques (chacun : fond clair / couleur / texte foncé)
        success: { light: '#DCFCE7', DEFAULT: '#16A34A', dark: '#15803D' },
        warning: { light: '#FEF3C7', DEFAULT: '#D97706', dark: '#B45309' },
        error: { light: '#FEE2E2', DEFAULT: '#DC2626', dark: '#B91C1C' },
        info: { light: '#E0F2FE', DEFAULT: '#0284C7', dark: '#0369A1' }
      },
      fontFamily: {
        // Variables injectées par next/font dans le layout racine.
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'var(--font-sans)', 'sans-serif']
      },
      fontSize: {
        // Échelle titres (utilisée pour Hero / sections vitrine).
        'display-lg': ['clamp(2.5rem, 5vw, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['clamp(1.75rem, 3vw, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }]
      },
      borderRadius: {
        '4xl': '2rem'
      },
      spacing: {
        // Hauteur des grands boutons (taille `lg`) et rythmes ponctuels.
        13: '3.25rem'
      },
      boxShadow: {
        // Ombres douces et diffuses — jamais dures (ambiance premium/rassurante).
        soft: '0 1px 2px rgba(16,42,51,0.04), 0 2px 8px rgba(16,42,51,0.06)',
        card: '0 2px 4px rgba(16,42,51,0.04), 0 8px 24px rgba(16,42,51,0.08)',
        lifted: '0 12px 32px rgba(16,42,51,0.12)',
        focus: '0 0 0 3px rgba(46,147,169,0.35)'
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
        'scale-in': 'scale-in 0.3s ease-out both'
      }
    }
  },
  plugins: []
};

export default config;
