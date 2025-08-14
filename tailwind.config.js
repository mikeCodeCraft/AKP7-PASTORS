/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  // Safelist dynamic classes that are built via template strings (e.g., `hover:${themeClasses.text}`)
  safelist: [
    // Text colors (with hover variants)
    { pattern: /^(text)-(white|gray-(900|600|500|400|300))$/, variants: ['hover'] },
    // Border colors (with hover variants)
    { pattern: /^(border)-(gray-(800|600|400|300|200))$/, variants: ['hover'] },
    // Background helpers used via variables
    'bg-white/5',
    'bg-white/10',
    'bg-gray-50',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};