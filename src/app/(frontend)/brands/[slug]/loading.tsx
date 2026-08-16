import React from 'react'

export default function BrandLoading() {
  return (
    <div className="section-padding pt-6 pb-16">
      <div className="h-4 w-48 bg-bg-surface rounded mb-8 animate-pulse" />
      <div className="h-14 w-40 bg-bg-surface rounded animate-pulse mb-4" />
      <div className="h-8 w-64 bg-bg-surface rounded animate-pulse mb-2" />
      <div className="h-4 w-full max-w-2xl bg-bg-surface rounded animate-pulse mb-10" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-square bg-bg-surface rounded-sm animate-pulse" />
            <div className="h-3 w-20 bg-bg-surface rounded animate-pulse mt-3" />
            <div className="h-4 w-full bg-bg-surface rounded animate-pulse mt-2" />
            <div className="h-4 w-16 bg-bg-surface rounded animate-pulse mt-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
