'use server'

import { getPayloadInstance, setAuthCookie, clearAuthCookie } from '@/lib/auth'

export interface AuthResult {
  ok: boolean
  error?: string
}

export async function registerAction(input: {
  name: string
  email: string
  password: string
}): Promise<AuthResult> {
  const name = input.name?.trim()
  const email = input.email?.trim().toLowerCase()
  const password = input.password

  if (!name || !email || !password) {
    return { ok: false, error: 'Please fill in all fields.' }
  }

  const payload = await getPayloadInstance()

  try {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return { ok: false, error: 'An account with this email already exists.' }
    }

    await payload.create({
      collection: 'users',
      data: {
        name,
        email,
        password,
      },
    })

    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (result.token) {
      await setAuthCookie(result.token)
    }

    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Registration failed.',
    }
  }
}

export async function loginAction(input: {
  email: string
  password: string
}): Promise<AuthResult> {
  const email = input.email?.trim().toLowerCase()
  const password = input.password

  if (!email || !password) {
    return { ok: false, error: 'Please enter your email and password.' }
  }

  const payload = await getPayloadInstance()

  try {
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (result.token) {
      await setAuthCookie(result.token)
    }

    return { ok: true }
  } catch {
    return { ok: false, error: 'Invalid email or password.' }
  }
}

export async function logoutAction(): Promise<void> {
  await clearAuthCookie()
}
