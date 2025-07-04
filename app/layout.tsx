import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FontChecker } from "@/components/FontChecker";
import { QueryProvider } from "@/components/providers/query-provider";
import { GTMBody } from "@/components/gtm";
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
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-T6LPB56Z');
        `}
      </Script>
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
      </body>
    </html>
  );
}
