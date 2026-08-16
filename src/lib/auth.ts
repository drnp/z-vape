import 'server-only'

import { cookies, headers } from 'next/headers'
import { getPayload, generatePayloadCookie } from 'payload'
import configPromise from '@payload-config'
import type { User } from '@/payload-types'

export async function getPayloadInstance() {
  return getPayload({ config: configPromise })
}

export async function getCurrentUser(): Promise<User | null> {
  const payload = await getPayloadInstance()
  const { user } = await payload.auth({ headers: await headers() })
  return (user as User | null) ?? null
}

export async function setAuthCookie(token: string) {
  const payload = await getPayloadInstance()
  const auth = payload.config.collections.find((c) => c.slug === 'users')?.auth
  if (!auth) throw new Error('Users collection auth config not found')

  const obj = generatePayloadCookie({
    collectionAuthConfig: auth,
    cookiePrefix: payload.config.cookiePrefix,
    token,
    returnCookieAsObject: true,
  })

  const store = await cookies()
  store.set(obj.name, obj.value ?? '', {
    domain: obj.domain,
    expires: obj.expires ? new Date(obj.expires) : undefined,
    httpOnly: obj.httpOnly,
    maxAge: obj.maxAge,
    path: obj.path,
    sameSite: obj.sameSite
      ? (obj.sameSite.toLowerCase() as 'lax' | 'none' | 'strict')
      : undefined,
    secure: obj.secure,
  })
}

export async function clearAuthCookie() {
  const payload = await getPayloadInstance()
  const cookieName = `${payload.config.cookiePrefix}-token`
  const store = await cookies()
  store.delete(cookieName)
}
