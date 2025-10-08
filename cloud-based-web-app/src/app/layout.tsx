import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";
import { ThemeLoader } from "@/components/ThemeLoader"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LTU Assignment",
  description: "Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ThemeLoader /> 
          <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--text-color)] transition-colors duration-200">
            <Header />
            <main className="flex-grow container mx-auto">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}