import "@fontsource/poppins/300.css"
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/500.css"
import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#7f32cd",
      light: "#ffffff",
      dark: "#000000",
    },
    secondary: {
      main: "#13cdcd",
    },
  },
  typography: {
    fontFamily: "Poppins",
    h1: {
      fontSize: "31.5px",
      fontWeight: 500,
    },
    h2: {
      fontSize: "18px",
      fontWeight: 400,
    },
    body1: {
      fontSize: "12px",
      fontWeight: 300,
    },
  },
})

export { theme }
