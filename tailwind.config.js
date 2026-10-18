/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#009447',
          dark: '#184A35',
          light: '#78A603',
          olive: '#5F8610',
        },
        sage: {
          DEFAULT: '#C7D2A8',
          light: '#DCE2C8',
          dark: '#9DAD86',
          border: '#D3DBB9',
          deep: '#B0C084',
        },
        cream: {
          DEFAULT: '#FBF7F3',
          dark: '#F3EBE1',
        },
        foreground: '#18382A',
        muted: '#5C7C6D',
        accent: '#78A603',
        earthy: '#40573D',
        error: '#D32F2F',
      },
      fontFamily: {
        sans: ['DM Sans', 'Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(24, 74, 53, 0.05), 0 2px 8px -1px rgba(24, 74, 53, 0.03)',
        'premium-hover': '0 10px 30px -5px rgba(24, 74, 53, 0.08), 0 4px 12px -2px rgba(24, 74, 53, 0.04)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
