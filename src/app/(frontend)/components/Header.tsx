'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { X, Search, User, ShoppingCart, LogOut } from 'lucide-react'
import { useCart } from './CartContext'
import { logoutAction } from '../actions/auth'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/brands/alibarbar', label: 'Alibarbar' },
  // IGET 已停用（恢复时取消注释）
  // { href: '/brands/iget', label: 'iGet' },
  { href: '/brands/snowplus', label: 'SnowPlus' },
  { href: '/verification', label: 'Verification' },
  { href: '/support', label: 'Support' },
  { href: '/contact', label: 'Contact' },
] as const

function NavLink({
  href,
  label,
  pathname,
  onClick,
}: {
  href: string
  label: string
  pathname: string
  onClick?: () => void
}) {
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative flex h-full items-center text-sm font-semibold tracking-[0.2em] uppercase transition-colors hover:text-text-gold ${isActive ? 'text-gold font-bold' : 'text-text-secondary'}`}
    >
      {label}
      <span
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gold transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
      />
    </Link>
  )
}

export function Header({ user }: { user: { name: string } | null }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { totalItems } = useCart()

  const handleLogout = async () => {
    await logoutAction()
    router.refresh()
  }

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl">
        {showBanner && (
          <div className="section-padding relative flex items-center justify-center h-auto min-h-10 bg-gold py-2 md:h-10 md:py-0">
            <span className="text-[10px] md:text-sm font-bold text-black tracking-wide text-center px-8 md:px-0 leading-snug">
              SIGN UP TO BE A MEMBER, ENJOY 10% DISCOUNT ON YOUR FIRST PURCHASE
            </span>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-3 md:right-5 transition-colors shrink-0 text-black"
              aria-label="Close banner"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <div className="section-padding relative flex items-center justify-between h-20">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gold" />
          <button
            className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 8h16M4 16h16" />
              </svg>
            )}
          </button>

          <Link href="/" className="shrink-0">
            <Image
              src="/assets/logo-s.png"
              alt="Z-VAPE"
              width={80}
              height={41}
              className="h-auto w-auto"
              loading="eager"
            />
          </Link>

          <nav className="hidden md:flex items-stretch h-full gap-8 lg:gap-10">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} pathname={pathname} />
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              aria-label="Search"
              className="transition-colors text-gold hover:text-gold-light"
            >
              <Search size={18} />
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-xs hidden sm:inline">
                  Hi, {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  aria-label="Sign out"
                  className="transition-colors text-gold hover:text-gold-light"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                aria-label="Sign in"
                className="transition-colors text-gold hover:text-gold-light"
              >
                <User size={18} />
              </Link>
            )}
            <Link
              href="/cart"
              aria-label="Cart"
              className="transition-colors text-gold hover:text-gold-light relative"
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-black text-[9px] flex items-center justify-center rounded-full font-bold leading-none">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-bg pt-40">
          <nav className="flex flex-col items-center justify-center gap-10 h-full">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                pathname={pathname}
                onClick={() => setMobileOpen(false)}
              />
            ))}
            <NavLink
              href="/cart"
              label={`Cart${totalItems > 0 ? ` (${totalItems})` : ''}`}
              pathname={pathname}
              onClick={() => setMobileOpen(false)}
            />
          </nav>
        </div>
      )}
    </>
  )
}
