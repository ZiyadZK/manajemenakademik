import { Inter } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Sikapun",
  description: "Sistem manajamen akademik",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
