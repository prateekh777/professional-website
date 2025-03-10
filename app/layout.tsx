import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import { FontChecker } from '@/components/FontChecker'
import { QueryProvider } from '@/components/providers/query-provider'
import { aeonik } from './fonts'
import './globals.css'
import '@/support_data/index.css'

export const metadata: Metadata = {
  title: 'Prateek Hakay - Portfolio',
  description: 'Professional portfolio showcasing my work and expertise',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={aeonik.variable}>
      <body className="font-aeonik">
        <QueryProvider>
          <div className="relative min-h-screen">
            <Header />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
            <FontChecker />
          </div>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
} 