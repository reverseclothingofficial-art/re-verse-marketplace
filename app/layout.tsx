import type { Metadata } from 'next'
import './globals.css'
import { CookieProvider } from '../context/cookieContext'

export const metadata: Metadata = {
  title: 're-verse.in',
  description: "Discover re-verse.in – India’s premier online fashion marketplace for emerging and early-stage brands. Explore unique apparel, accessories, and lifestyle products from trendsetting designers. Shop exclusive launches, personalized recommendations, and limited-edition collections. Experience seamless shopping, secure payments, and easy returns. Be the first to discover tomorrow’s top brands, today.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <CookieProvider>
          {children}
        </CookieProvider>
      </body>
    </html>
  )
}
