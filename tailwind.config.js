/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        "noto-emoji": "Noto Color Emoji",
      },
      fontSize: {
        xxs: "0.625rem",
      },
      colors: {
        tako: "#A17171",
        text: "#494949",
        background: "#FFFFFF",
        line: "#DDDDDD",
        "background-sub": "#FAF9F9",
        "genre-comic": "#F08C43",
      },
      backgroundImage: {
        gradation: "url('/app/assets/images/gradation.png')",
      },
    },
  },
  plugins: [],
};
