"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme } from "styles/themes/darkThemeOptions";
import "app/globals.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"] });

const materialSymbols = localFont({
  variable: "--font-family-symbols", // Variable name (to reference after in CSS/styles)
  style: "normal",
  src: "../node_modules/material-symbols/material-symbols-outlined.woff2", // This is a reference to woff2 file from NPM package "material-symbols"
  display: "block",
  weight: "100 700",
});

export const metadata = {
  title: "DynaD",
  description: "Plug N Play containerized file manager.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${materialSymbols.variable}`}>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/icon.ico" />
      </head>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <body className={inter.className}>{children}</body>
      </ThemeProvider>
    </html>
  );
}
