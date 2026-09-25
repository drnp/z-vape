'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginAction, registerAction } from '../actions/auth'

type Mode = 'login' | 'register'

const inputClass =
  'w-full h-12 px-4 bg-transparent border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors rounded-sm'

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result =
      mode === 'register'
        ? await registerAction({ name, email, password })
        : await loginAction({ email, password })

    setLoading(false)

    if (!result.ok) {
      setError(result.error ?? 'Something went wrong.')
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="section-padding py-16 md:py-24 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="font-heading text-3xl md:text-4xl mb-2 text-center">
          {mode === 'register' ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-text-secondary text-sm text-center mb-10">
          {mode === 'register'
            ? 'Sign up to check out faster and track your orders.'
            : 'Log in to continue to checkout.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {mode === 'register' && (
            <div>
              <label className="block text-text-secondary text-xs tracking-[0.15em] uppercase mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-text-secondary text-xs tracking-[0.15em] uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-text-secondary text-xs tracking-[0.15em] uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center h-12 rounded-full text-sm font-semibold tracking-widest uppercase text-white hover:opacity-80 disabled:opacity-50 transition-opacity"
            style={{ background: '#daa34a' }}
          >
            {loading
              ? 'Please wait…'
              : mode === 'register'
                ? 'Create Account'
                : 'Log In'}
          </button>
        </form>

        <p className="text-text-secondary text-sm text-center mt-8">
          {mode === 'register' ? (
            <>
              Already have an account?{' '}
              <Link href={`/login${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`} className="text-gold hover:text-gold-light">
                Log in
              </Link>
            </>
          ) : (
            <>
              New here?{' '}
              <Link href={`/register${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`} className="text-gold hover:text-gold-light">
                Create an account
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
