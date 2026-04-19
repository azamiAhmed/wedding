import type { Metadata } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ag-wedding.com"),
  title: "Ghizlaine & Ahmed — 2 Octobre 2026",
  description:
    "Célébrez avec nous le mariage de Ghizlaine et Ahmed. Confirmez votre présence et découvrez les détails de la cérémonie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${cormorant.variable} ${geistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
