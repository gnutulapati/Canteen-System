/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // SRCM Official Color Palette
        primary: {
          DEFAULT: "#132450", // Navy - Navbar, Footer
          dark: "#0a1530",
        },
        secondary: {
          DEFAULT: "#fbaf41", // Gold/Orange - Buttons, Highlights (Sun)
          light: "#fcc975",
          dark: "#e89c2a",
        },
        accent: {
          DEFAULT: "#e2383a", // Red - Urgent notifications
          light: "#f05658",
          dark: "#c42d2f",
        },
        background: {
          DEFAULT: "#faf7f0", // Very light cream - easy on eyes
          cream: "#f2e8cf", // Original cream
        },
        text: {
          DEFAULT: "#2d3748", // Dark gray for readability
          light: "#4a5568",
        },
      },
    },
  },
  plugins: [],
};
