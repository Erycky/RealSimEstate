/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}",
    "./src/components/**/*.{astro,html,js,jsx,ts,tsx}",
    "./src/components/react/**/*.{astro,html,js,jsx,ts,tsx}",
    "./src/pages/**/*.{astro,html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sim: {
          dark: '#0B521E',
          light: '#AECBB4',
          bg: '#EBEBEB',
        }
      }
    },
  },
  plugins: [],
}