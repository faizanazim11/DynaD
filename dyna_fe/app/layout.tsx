"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme } from "styles/themes/darkThemeOptions";
import "app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
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
