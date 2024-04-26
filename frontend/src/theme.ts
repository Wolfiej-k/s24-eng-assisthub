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
    fontFamily: "'Poppins', sans-serif",
    //fontFamily: "Times",
    h1: {
      fontSize: "31.5px",
      fontWeight: 500,
    },
    h2: {
      fontSize: "18px",
      fontWeight: 500,
    },
    body1: {
      fontSize: "12px",
      fontWeight: 500,
    },
  },
})

export { theme }
