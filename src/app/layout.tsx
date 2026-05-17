import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppToaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/features/auth";
import { getServerSession } from "@/lib/auth/get-server-session";
import { Footer } from "@/widgets/footer";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSession = await getServerSession();

  return (
    <html
      lang="uk"
      className={`${inter.variable} h-full font-sans antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip bg-[#f5f7f9]">
        <AuthProvider initialSession={initialSession}>
          <div className="flex min-h-full flex-1 flex-col">
            <div className="flex flex-1 flex-col">{children}</div>
            <Footer />
          </div>
          <AppToaster />
        </AuthProvider>
      </body>
    </html>
  );
}
