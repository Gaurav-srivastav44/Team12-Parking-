module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "bg1": "url('/assets/bg1.jpg')",
        "bg2": "url('/assets/bg2.jpg')",
        "bg3": "url('/assets/bg3.jpg')",
        "bg4": "url('/assets/bg4.jpg')",
      },
      animation: {
        slide: "slide 20s infinite linear",
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(-200%)" },
          "75%": { transform: "translateX(-300%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
