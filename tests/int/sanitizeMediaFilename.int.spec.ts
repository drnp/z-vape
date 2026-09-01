import { describe, expect, it } from 'vitest'
import { formatHashedFilename } from '@/hooks/sanitizeMediaFilename'

describe('formatHashedFilename', () => {
  it('replaces the base name with a 16-char hex hash, keeping the extension', () => {
    expect(formatHashedFilename('photo of product.png')).toMatch(/^[a-f0-9]{16}\.png$/)
  })

  it('strips special characters and spaces from the base name', () => {
    expect(formatHashedFilename('产品 图 片 001 中文 !!.jpg')).toMatch(/^[a-f0-9]{16}\.jpg$/)
  })

  it('lowercases and sanitizes the extension', () => {
    expect(formatHashedFilename('cover.JPEG')).toMatch(/^[a-f0-9]{16}\.jpeg$/)
  })

  it('handles files without an extension', () => {
    expect(formatHashedFilename('my photo 2024')).toMatch(/^[a-f0-9]{16}$/)
  })

  it('strips unsafe characters from the extension', () => {
    expect(formatHashedFilename('report.v1?.tar?gz')).toMatch(/^[a-f0-9]{16}\.tar$/)
  })

  it('produces unique hashes for the same input', () => {
    const a = formatHashedFilename('same name.png')
    const b = formatHashedFilename('same name.png')
    expect(a).not.toBe(b)
  })
})