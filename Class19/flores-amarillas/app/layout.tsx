import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "🌻 Flores Amarillas",
  description:
    "Un jardín animado hecho con Next.js, CSS puro y mucho cariño.",
  authors: [{ name: "UNIVO" }],
};

export const viewport: Viewport = {
  themeColor: "#0b1026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}