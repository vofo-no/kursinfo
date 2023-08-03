module.exports = {
  presets: [require("@vofo-no/ui/tailwind-base")],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        tall: { raw: "screen and (min-height: 900px)" },
      },
      fontFamily: {
        "open-sans": ["var(--font-open-sans)"],
        lato: ["var(--font-lato)"],
      },
    },
  },
  plugins: [],
};
