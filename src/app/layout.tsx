import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "বাজার দর | BazarDor",
  description:
    "চাল, ডাল, মাছ, মাংস ও নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে দেখুন।",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          {children}
        </main>

        <Footer />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            success: {
              style: {
                background: "#16a34a",
                color: "#ffffff",
              },
            },
            error: {
              style: {
                background: "#dc2626",
                color: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}