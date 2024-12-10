/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    // due to https://github.com/tailwindlabs/tailwindcss/issues/6602 - buttons disappear
    preflight: false,
  },
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      gridTemplateRows: {
        1: "repeat(1, minmax(0, auto))",
        2: "repeat(2, minmax(0, auto))",
        3: "repeat(3, minmax(0, auto))",
        4: "repeat(4, minmax(0, auto))",
        5: "repeat(5, minmax(0, auto))",
        6: "repeat(6, minmax(0, auto))",
        7: "repeat(7, minmax(0, auto))",
        8: "repeat(8, minmax(0, auto))",
        9: "repeat(9, minmax(0, auto))",
        10: "repeat(10, minmax(0, auto))",
        11: "repeat(11, minmax(0, auto))",
        12: "repeat(12, minmax(0, auto))",
        13: "repeat(13, minmax(0, auto))",
        14: "repeat(14, minmax(0, auto))",
        15: "repeat(15, minmax(0, auto))",
        16: "repeat(16, minmax(0, auto))",
        17: "repeat(17, minmax(0, auto))",
        18: "repeat(18, minmax(0, auto))",
        19: "repeat(19, minmax(0, auto))",
        20: "repeat(20, minmax(0, auto))",
      },
    },
  },
  plugins: [],
};
