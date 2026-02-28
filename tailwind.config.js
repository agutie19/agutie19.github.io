/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5EDE3",
        lavender: "#C8B8D4",
        "medium-purple": "#9B7BB5",
        "rich-purple": "#6B4D8A",
        "deep-plum": "#2E1A47",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 6s ease infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
