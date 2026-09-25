import { describe, it, expect } from 'vitest'
import { isOptimizableImageSrc } from '@/lib/media'

describe('isOptimizableImageSrc', () => {
  it('accepts whitelisted local paths', () => {
    expect(isOptimizableImageSrc('/api/media/file/x.jpg')).toBe(true)
    expect(isOptimizableImageSrc('/assets/banner-01.jpg')).toBe(true)
    expect(isOptimizableImageSrc('/logo/alibarbar-s.png')).toBe(true)
    expect(isOptimizableImageSrc('/icon/genuine.png')).toBe(true)
    expect(isOptimizableImageSrc('/api/media/file/x.jpg?foo=1')).toBe(true)
  })
  it('rejects anything the loader would throw on', () => {
    expect(isOptimizableImageSrc(null)).toBe(false)
    expect(isOptimizableImageSrc(undefined)).toBe(false)
    expect(isOptimizableImageSrc('')).toBe(false)
    expect(isOptimizableImageSrc('http://evil.com/a.png')).toBe(false)
    expect(isOptimizableImageSrc('//evil.com/a.png')).toBe(false)
    expect(isOptimizableImageSrc('/uploads/legacy.png')).toBe(false)
    expect(isOptimizableImageSrc('/media/x.jpg')).toBe(false)
    expect(isOptimizableImageSrc('data:image/png;base64,xyz')).toBe(false)
  })
})
