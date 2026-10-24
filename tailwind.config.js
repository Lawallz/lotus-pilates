/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta da marca Lotus e Movimento Pilates:
        // navy = azul do "Movimento Pilates" | gold = dourado do lótus/LOTUS | sage = verde-água das paredes do estúdio
        cream: '#FAF7F2',
        ink: '#23303B',
        navy: {
          50: '#F1F5F9',
          100: '#DCE6EF',
          200: '#B9CDDF',
          300: '#8DAECB',
          400: '#5C86AE',
          500: '#386894',
          600: '#2A5A82',
          700: '#234A6B',
          800: '#1C3B55',
          900: '#142B40',
        },
        gold: {
          50: '#FDF8EC',
          100: '#F9EBC9',
          200: '#F3DA9D',
          300: '#EBC46A',
          400: '#DDAA3F',
          500: '#CE9227',
          600: '#A9741B',
          700: '#865A17',
        },
        sage: {
          50: '#F2F7F5',
          100: '#E1ECE8',
          200: '#C4D9D2',
          300: '#A5C4BA',
          400: '#86AEA3',
          500: '#6A978B',
        },
        sand: {
          50: '#FAF6F0',
          100: '#F3EBDD',
          200: '#E8D9C1',
        },
        clay: {
          100: '#F4E4DC',
          300: '#DDAE9A',
          500: '#C07D62',
          600: '#A6644B',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        cinzel: ['Cinzel', '"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(28, 59, 85, 0.28)',
        card: '0 2px 20px -4px rgba(43, 47, 42, 0.08)',
        glow: '0 0 0 1px rgba(221,170,63,0.35), 0 12px 50px -8px rgba(42,90,130,0.55)',
        'glow-sand': '0 0 40px -6px rgba(221,170,63,0.7)',
        lift: '0 24px 60px -20px rgba(20,43,64,0.38)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%) skewX(-20deg)' },
          '60%, 100%': { transform: 'translateX(320%) skewX(-20deg)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(6%,-8%,0) scale(1.12)' },
          '66%': { transform: 'translate3d(-5%,6%,0) scale(0.94)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        shimmer: 'shimmer 3.6s ease-in-out infinite',
        aurora: 'aurora 18s ease-in-out infinite',
        'aurora-slow': 'aurora 26s ease-in-out infinite reverse',
        'pulse-ring': 'pulseRing 2.4s ease-out infinite',
      },
    },
  },
  plugins: [],
}
