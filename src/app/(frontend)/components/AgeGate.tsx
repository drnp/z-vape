'use client'

import React, { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'z-vape-age-verified'

let verified =
  typeof window === 'undefined' ? true : localStorage.getItem(STORAGE_KEY) === 'true'
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return verified
}

function getServerSnapshot() {
  return true
}

function confirmVerified() {
  verified = true
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, 'true')
  }
  for (const listener of listeners) listener()
}

export function AgeGate() {
  const isVerified = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const handleConfirm = () => {
    confirmVerified()
  }

  const handleDecline = () => {
    window.location.href = 'https://www.google.com'
  }

  if (isVerified) return null

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-bg/95 backdrop-blur-md">
      <div className="max-w-sm w-full mx-4 p-8 md:p-10 border border-border bg-bg-surface text-center">
        {/* Shield icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 text-gold mb-6">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        <h2 className="font-heading text-xl md:text-2xl mb-3">Age Verification</h2>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-10">
          You must be 18 years or older to access this website. Products contain nicotine, which is
          an addictive chemical.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-gold text-bg text-xs md:text-sm tracking-[0.2em] uppercase font-semibold hover:bg-gold-light transition-colors duration-300"
          >
            I am 18 or older
          </button>
          <button
            onClick={handleDecline}
            className="w-full py-3 border border-text-muted text-text-secondary text-xs md:text-sm tracking-[0.2em] uppercase hover:border-text-secondary hover:text-text-primary transition-all duration-300"
          >
            I am under 18
          </button>
        </div>
      </div>
    </div>
  )
}
