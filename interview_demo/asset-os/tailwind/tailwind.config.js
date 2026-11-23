/** Asset Living palette, read from assetliving.com's CSS variables (Nov 2026). */

// Colours that change between light and dark mode are CSS variables, set in input.css
// (:root for light, .dark for dark). The class names in the markup stay the same.
const themed = (name) => `rgb(var(--al-${name}) / <alpha-value>)`;

module.exports = {
  darkMode: "class",
  content: ["../index.html", "../js/app.js", "../js/shell.js", "../js/chat.js"],
  theme: {
    extend: {
      colors: {
        al: {
          deep: "#154571",      // --deep-blue: headings, buttons
          navy: "#0c1827",      // --dark-blue: body text, sidebar
          night: "#0c1827",     // dark text that stays dark in both modes (on green or orange)
          surface: themed("surface"), // cards, top bar, panels (white in light mode)
          cream: themed("cream"),     // --cream: page background
          sand: themed("sand"),       // --cream-hover: borders
          blue: "#3ea0c7",      // --asset-blue: accents
          greyblue: "#a5bac9",  // --asset-grey-blue
          light: themed("light"),     // --light-gray
          orange: "#f6a800",    // --asset-orange
          green: "#93d500",     // --asset-green
          good: themed("good"),       // darker green for readable text
          amber: themed("amber"),     // darker orange for readable text
          red: "#b42318",       // alert red (not in the brand palette)
        },
      },
      // As text or a border, navy, deep blue and red have to flip in dark mode. As a
      // background (sidebar, buttons, status blocks) they keep their brand value.
      textColor: { al: { navy: themed("ink"), deep: themed("ink-deep"), red: themed("ink-red") } },
      borderColor: { al: { navy: themed("ink"), deep: themed("ink-deep") } },
      backgroundColor: { al: { deep: themed("deep-bg") } },
      fontFamily: {
        // The site uses Freight Display Pro and Gilroy (licensed). These free fonts are close stand-ins.
        // v2 (platform concept): headings use the same sans as the body, for a product feel.
        display: ['"Plus Jakarta Sans"', "Arial", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
