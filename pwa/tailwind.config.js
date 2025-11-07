module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        text: 'var(--text)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
  darkMode: ['class', '[data-theme="dark"]'],
}
