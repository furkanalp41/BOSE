/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep-space backgrounds (Furkan's primary palette)
        void:   '#050508',
        cosmos: '#0a0a12',
        abyss:  '#0f0f1a',
        panel:  '#13131f',
        card:   '#1a1a2e',
        border: '#252540',

        // Neon accents
        neon:    '#00ff88',
        neonDim: '#00cc6a',
        crimson: '#ff3b5c',
        amber:   '#ffb800',
        ice:     '#00cfff',

        // Text
        silver: '#a0aec0',
        cloud:  '#e2e8f0',

        // Enes's color aliases (so his components work without edits)
        surface: {
          DEFAULT: '#050508',
          card: '#13131f',
          border: '#252540',
          muted: '#30363d',
        },
        brand: {
          DEFAULT: '#00cfff',
          dim: '#00aacc',
        },
        bull: {
          DEFAULT: '#00ff88',
          dim: '#00cc6a',
          glow: 'rgba(0,255,136,0.25)',
        },
        bear: {
          DEFAULT: '#ff3b5c',
          dim: '#cc3350',
          glow: 'rgba(255,59,92,0.25)',
        },
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },

      boxShadow: {
        'neon-sm':   '0 0 8px rgba(0, 255, 136, 0.4)',
        'neon-md':   '0 0 20px rgba(0, 255, 136, 0.35)',
        'neon-lg':   '0 0 40px rgba(0, 255, 136, 0.25)',
        'ice-sm':    '0 0 8px rgba(0, 207, 255, 0.4)',
        'ice-md':    '0 0 20px rgba(0, 207, 255, 0.3)',
        'crimson-sm':'0 0 8px rgba(255, 59, 92, 0.45)',
        'crimson-md':'0 0 20px rgba(255, 59, 92, 0.35)',
        'glass':     '0 8px 32px rgba(0, 0, 0, 0.6)',
        'card':      '0 4px 24px rgba(0, 0, 0, 0.5)',
        'glow-bull': '0 0 20px rgba(0,255,136,0.4)',
        'glow-bear': '0 0 20px rgba(255,68,102,0.4)',
        'glow-brand': '0 0 20px rgba(0,212,255,0.3)',
      },

      backdropBlur: {
        xs: '2px',
        glass: '20px',
      },

      keyframes: {
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,255,136,0.3)' },
          '50%':       { boxShadow: '0 0 30px rgba(0,255,136,0.7)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        'grid-flow': {
          '0%':   { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        ticker: {
          '0%': { opacity: 0.4, transform: 'scale(1.04)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
        'grid-flow':  'grid-flow 8s linear infinite',
        'shimmer':    'shimmer 3s ease-in-out infinite',
        'spin-slow':  'spin-slow 20s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        ticker: 'ticker 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
}
