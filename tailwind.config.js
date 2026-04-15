/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fef7ec',
          100: '#fdecc8',
          200: '#fbd68c',
          300: '#f9ba4f',
          400: '#f8a226',
          500: '#f2830d',
          600: '#d66208',
          700: '#b1450b',
          800: '#903710',
          900: '#762f11',
        },
        ink: {
          950: '#0a0a0b',
          900: '#111113',
          800: '#1a1a1d',
          700: '#26262b',
          600: '#3a3a42',
        },
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(242, 131, 13, 0.45)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        blob: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(40px,-30px) scale(1.1)' },
          '66%': { transform: 'translate(-30px,40px) scale(0.95)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        reveal: {
          '0%': { opacity: 0, transform: 'translateY(40px)', filter: 'blur(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out both',
        floaty: 'floaty 8s ease-in-out infinite',
        blob: 'blob 18s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        shimmer: 'shimmer 4s linear infinite',
        reveal: 'reveal 1.1s cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [],
}
