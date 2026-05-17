import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AuthProvider } from "@/features/auth";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "ActiveCity — Бронювання спортивних майданчиків",
  description:
    "Онлайн-платформа для бронювання футбольних полів, баскетбольних та тенісних кортів у вашому місті.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${inter.variable} h-full font-sans antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
