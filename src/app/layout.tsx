import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@/styles/globals.css';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Alvaro Leon",
  description: "Software Engineer and Graphic Designer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
