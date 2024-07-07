import { Inter } from "next/font/google";
import "./globals.css";
import { jakarta } from "@/config/fonts";

export const metadata = {
  title: "Simak",
  description: "Sistem manajamen akademik",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jakarta.className}>{children}</body>
    </html>
  );
}
