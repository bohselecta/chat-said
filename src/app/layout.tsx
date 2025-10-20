import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChatSaid - AI-Enhanced Innovation Lab',
  description: 'A portfolio of AI-enhanced projects spanning mental health, civic technology, democracy tools, and far-out computing concepts. Where AI meets audacious ideas.',
  keywords: ['AI innovation', 'mental health tools', 'civic technology', 'democracy tools', 'NLP research', 'computing paradigms', 'therapy tools', 'anti-corruption', 'participatory democracy'],
  authors: [{ name: 'ChatSaid Innovation Lab' }],
  openGraph: {
    title: 'ChatSaid - AI-Enhanced Innovation Lab',
    description: 'A portfolio of AI-enhanced projects spanning mental health, civic technology, democracy tools, and far-out computing concepts.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
