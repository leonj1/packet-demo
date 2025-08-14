/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          950: '#030712',
        },
        neon: {
          blue: '#00d4ff',
          purple: '#b300ff',
          pink: '#ff00ff',
          green: '#00ff88',
          yellow: '#ffff00',
          orange: '#ff6600',
        },
        cyber: {
          dark: '#0a0e27',
          darker: '#040614',
          light: '#1a1f3a',
          accent: '#00ffcc',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgb(0 212 255 / 0.5), 0 0 20px rgb(0 212 255 / 0.3)' },
          '100%': { boxShadow: '0 0 20px rgb(0 212 255 / 0.8), 0 0 40px rgb(0 212 255 / 0.5)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #00d4ff 75%, #00ff88 100%)',
        'dark-gradient': 'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(179, 0, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 50% 100%, rgba(0, 255, 136, 0.1) 0%, transparent 50%)',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
        'tech': ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}