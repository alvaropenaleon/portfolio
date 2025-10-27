import type { Metadata } from "next";
import { Inter,  JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ui/themeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["300","400","500","700"], // adjust to taste
  variable: "--font-mono",
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
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.variable} ${mono.variable}`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}