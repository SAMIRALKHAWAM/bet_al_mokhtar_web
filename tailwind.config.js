// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem',
      },
      colors: {
        // هنا فقط للتوثيق، الألوان المستخدمة عبر CSS Variables
        light: {
          bg: '#ffffff',
          text: '#000000',
        },
        dark: {
          bg: '#1a1a1a',
          text: '#ffffff',
        },
        blue: {
          bg: '#dbeafe',
          text: '#1e40af',
        },
        green: {
          bg: '#dcfce7',
          text: '#166534',
        },
      },
    },
  },
  darkMode: ['class'],
  plugins: [],
}
