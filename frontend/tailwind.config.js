/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#080C10',
        deep: '#0D1117',
        surface: '#141B24',
        raised: '#1C2535',
        hover: '#243040',

        amber: {
          light: '#5dbd9d',
          glow: '#10b98125',
          border: '#5dbd9d23',
          DEFAULT: '#10B981',
        },
        jade: {
          light: '#2EEFC8',
          glow: 'rgba(0, 201, 167, 0.12)',
          DEFAULT: '#00C9A7',
        },
        coral: {
          glow: 'rgba(255, 107, 107, 0.12)',
          DEFAULT: '#FF6B6B',
        },
        violet: {
          glow: 'rgba(139, 92, 246, 0.12)',
          DEFAULT: '#8B5CF6',
        },

        text: {
          primary: '#F0F4F8',
          secondary: '#8B9CB0',
          muted: '#4A5568',
        }
      },
      fontFamily: {
        body: ['Sora', 'sans-serif'],
        display: ['DM Serif Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0,0,0,0.4)',
        'md': '0 8px 24px rgba(0,0,0,0.5)',
        'lg': '0 20px 60px rgba(0,0,0,0.6)',
        'amber': '0 0 40px rgba(240, 165, 0, 0.2)',
        'jade': '0 0 40px rgba(0, 201, 167, 0.15)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '20px',
        'xl': '28px',
      }
    },
  },
  plugins: [],
}
