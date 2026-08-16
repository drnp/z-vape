export const FLAT_SHIPPING = 10
export const FREE_SHIPPING_THRESHOLD = 100

export function computeShipping(subtotal: number): number {
  if (subtotal <= 0) return 0
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0
  return FLAT_SHIPPING
}
