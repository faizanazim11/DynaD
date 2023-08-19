import { createTheme, ThemeOptions } from "@mui/material/styles";
import type { } from '@mui/x-data-grid/themeAugmentation';

export const darkTheme: ThemeOptions = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#582cb0",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212',
          paper: '#1e1e1e'
        },
      },
    },
  },
});
