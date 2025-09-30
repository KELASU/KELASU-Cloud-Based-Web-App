import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LTU Assignment",
  description: "LTU ASSIGNMENT - Kenneth Lay 22586517",
};

export default function RootLayout({
  children,
}: Readonly<{
  // This is the line that has been fixed
  children: React.ReactNode; 
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen bg-background text-text-color dark:bg-dark-background dark:text-dark-text-color transition-colors duration-200">
            <Header />
            <main className="p-8">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}