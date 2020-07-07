import Typography from "typography"
import "./global.css"
import parnassusTheme from "typography-theme-parnassus"
parnassusTheme.overrideThemeStyles = () => {
  return {
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
    "h1 code, h2 code, h3 code, h4 code, h5 code, h6 code": {
      fontSize: "inherit",
    },
    "li code": {
      fontSize: "1rem",
    },
    blockquote: {
      color: "inherit",
      borderLeftColor: "inherit",
      opacity: "0.8",
    },
    "blockquote.translation": {
      fontSize: "1em",
    },
    "p code": {
      fontSize: "1rem",
    },
  }
}

delete parnassusTheme.googleFonts

const typography = new Typography({
  ...parnassusTheme,
  baseFontFamily: ["MonoLisa", "monospace"],
  headerFontFamily: ["Dank Mono", "monospace"],
  bodyFontFamily: ["MonoLisa", "monospace"]
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
