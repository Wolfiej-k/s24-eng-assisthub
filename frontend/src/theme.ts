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
    fontFamily: "Poppins, sans-serif",
    h1: {
      fontSize: "31.5px",
      fontWeight: "lighter",
    },
    h2: {
      fontSize: "18px",
      fontWeight: "lighter",
    },
    body1: {
      fontSize: "12px",
      fontWeight: "lighter",
    },
  },
})

export { theme }
