import { createTheme } from "@mui/material/styles";
import { frFR } from "@mui/material/locale";

const theme = createTheme(
  {
    palette: {
      mode: "light",
      primary: { main: "#00949F" },
      secondary: { main: "#7C93F9" },
      text: { primary: "#1A1A1A", secondary: "#4B5563" },
    },
    typography: {
      // Police par défaut
      fontFamily: "Roboto, Inter, sans-serif",

      // Tu peux aussi isoler les titres si tu veux
      h1: {
        fontFamily: "Fredoka, sans-serif",
        fontWeight: 500,
        fontSize: "2.5rem",
      },
      h2: {
        fontFamily: "Fredoka, sans-serif",
        fontWeight: 400,
        fontSize: "2rem",
      },
      h3: {
        fontFamily: "Fredoka, sans-serif",
        fontWeight: 500,
        fontSize: "1.75rem",
      },
      // etc. pour h4,h5,h6…
      body1: {
        fontSize: "1rem",
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#00949F",
            },
          },
        },
      },
    },
  },
  frFR
);

export default theme;
