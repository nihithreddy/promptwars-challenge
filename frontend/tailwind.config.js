/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          red: "#ef4444",
          yellow: "#eab308",
          green: "#22c55e",
          cyan: "#00f0ff",
          background: "#050505",
          card: "#0f172a",
          border: "#1e293b"
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)' },
          '50%': { transform: 'scale(1.02)', boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
