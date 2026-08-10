import { createTheme } from "@mui/material/styles";

// Brand palette: blue primary, amber-yellow accent, soft off-white
// background. Light mode only for now — the goal is a demo
// that looks considered, not a full design system.
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#307FE2",
      light: "#5C9AEA",
      dark: "#245FAA",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FDB833",
      contrastText: "#1c2536",
    },
    background: {
      default: "#f6f4ef",
      paper: "#ffffff",
    },
    text: {
      primary: "#1c2536",
      secondary: "#5b6472",
    },
    divider: "rgba(28, 37, 54, 0.08)",
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
      defaultProps: { color: "default", elevation: 0 },
    },
  },
});
