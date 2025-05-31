const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        quirky: ["Quicksand", "sans-serif"],
      },
    },
  },
  plugins: ["@tailwindcss/postcss"],
};

export default config;
