module.exports = {
  presets: [require("@vofo-no/ui/tailwind-base")],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        tall: { raw: "screen and (min-height: 900px)" },
      },
    },
  },
  plugins: [],
};
