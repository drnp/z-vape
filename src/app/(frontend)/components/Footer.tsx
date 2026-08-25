import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-bg-surface border-t border-border">
      <div className="section-padding h-px bg-gold" />
      <div className="section-padding py-12 md:py-16 flex flex-col items-center gap-6">
        <Link href="/">
          <Image
            src="/assets/logo-m.png"
            alt="Z-VAPE"
            width={140}
            height={56}
            className="h-auto w-auto"
          />
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-0 text-gold text-xs md:text-sm tracking-wider uppercase">
          <Link href="/">Home</Link>
          <Link href="/brands/alibarbar">Alibarbar</Link>
          <Link href="/brands/iget">iGet</Link>
          <Link href="/brands/snowplus">SnowPlus</Link>
          <Link href="/verification">Verification</Link>
          <Link href="/support">Support</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-6 text-text-muted text-xs md:text-sm">
          <span>(+52)09-1234-5678</span>
          <a href="mailto:sales@z-vape.com">sales@z-vape.com</a>
          <a href="mailto:support@z-vape.com">support@z-vape.com</a>
        </div>

        <div className="h-25" />
      </div>
    </footer>
  )
}
