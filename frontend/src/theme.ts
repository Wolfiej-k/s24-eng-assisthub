import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#7f32cd",
    },
    secondary: {
      main: "#000000",
      light: "#ffffff",
      contrastText: "#13cdcd",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h1: {
      fontSize: "31.5px",
      fontWeight: "bold",
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
