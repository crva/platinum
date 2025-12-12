import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./main.css";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
        <Analytics />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
