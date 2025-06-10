import type { Metadata } from 'next'
import { Providers } from './providers' // Bỏ comment

export const metadata: Metadata = {
  title: 'ICO Platform',
  description: 'Initial Coin Offering Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}