import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChatSaid - AI-powered therapy tools',
  description: 'Science-informed, AI-enhanced tools to support your therapeutic journey. Built with care, guided by research, designed for insight.',
  keywords: ['mental health', 'therapy tools', 'AI', 'wellness', 'self-care'],
  authors: [{ name: 'ChatSaid Team' }],
  openGraph: {
    title: 'ChatSaid - AI-powered therapy tools',
    description: 'Science-informed, AI-enhanced tools to support your therapeutic journey.',
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
