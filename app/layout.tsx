import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'spam-detector',
  description: 'Team AI 3 grup 2',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
