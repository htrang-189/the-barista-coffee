/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium muted palette (The Coffee House inspired)
        primary: '#1A1A1A',        // Deep coffee black
        secondary: '#8B6F47',      // Coffee brown
        accent: '#D4A574',         // Light tan
        neutral: {
          50: '#F9F7F4',           // Off-white
          100: '#F2EFE9',
          200: '#E8E3D9',
          300: '#DDD7CB',
          400: '#B5AEA0',
          500: '#8E8680',
          600: '#6B6560',
          700: '#524D47',
          800: '#3C3C3C',
          900: '#1A1A1A',
        },
        error: '#DC2626',
        success: '#10B981',
        warning: '#F59E0B',
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '40px'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      borderRadius: {
        'sm': '2px',
        'md': '4px',
        'lg': '8px',
        'xl': '12px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
    fontFamily: {
      'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      'serif': ['Merriweather', 'serif'],
    },
  },
  plugins: [],
};
