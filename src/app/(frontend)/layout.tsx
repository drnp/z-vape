import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import React from 'react'

import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { AgeGate } from './components/AgeGate'
import { CartProvider } from './components/CartContext'
import { getCurrentUser } from '@/lib/auth'
import './globals.css'

export const dynamic = 'force-dynamic'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Z-VAPE | Premium Vaping Products Australia',
  description:
    "Discover Australia's finest collection of premium vape products from IGET, Alibarbar, Snowplus Cash and more. Fast shipping, 100% authentic.",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AgeGate />
        <CartProvider>
          <Header user={user ? { name: user.name } : null} />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
