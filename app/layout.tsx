import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FontChecker } from "@/components/FontChecker";
import { QueryProvider } from "@/components/providers/query-provider";
import { GTMHead, GTMBody } from "@/components/gtm";
import "./globals.css";
import "@/support_data/index.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Prateek Hakay - Portfolio",
  description: "Professional portfolio showcasing my work and expertise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body>
        <GTMBody gtmId="GTM-T6LPB56Z" />
        <QueryProvider>
          <div className="relative min-h-screen">
            <Header />
            <main className="container mx-auto px-4 py-8">{children}</main>
            <Footer />
            <FontChecker />
          </div>
          <Toaster />
        </QueryProvider>
        <GTMHead gtmId="GTM-T6LPB56Z" />
      </body>
    </html>
  );
}
