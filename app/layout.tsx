import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VibeCherry 🍒 - The Sweetest Specs on the Web',
  description: 'MD/JSON spec library for AI code generation. Browse, create, and download battle-tested specifications.',
  keywords: ['AI', 'code generation', 'specifications', 'markdown', 'JSON', 'templates'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
