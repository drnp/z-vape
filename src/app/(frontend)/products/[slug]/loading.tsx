import React from 'react'

export default function ProductLoading() {
  return (
    <div className="section-padding pt-6 pb-16">
      <div className="h-4 w-48 bg-bg-surface rounded mb-8 animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square bg-bg-surface rounded-sm animate-pulse" />

        <div className="flex flex-col gap-5">
          <div className="h-3 w-20 bg-bg-surface rounded animate-pulse" />
          <div className="h-8 w-64 bg-bg-surface rounded animate-pulse" />
          <div className="h-6 w-32 bg-bg-surface rounded animate-pulse" />

          <div className="flex gap-4 mt-2">
            <div className="h-16 w-24 bg-bg-surface rounded-sm animate-pulse" />
            <div className="h-16 w-24 bg-bg-surface rounded-sm animate-pulse" />
            <div className="h-16 w-24 bg-bg-surface rounded-sm animate-pulse" />
          </div>

          <div className="h-4 w-36 bg-bg-surface rounded animate-pulse" />

          <div className="border-t border-border pt-5 mt-4">
            <div className="h-4 w-full bg-bg-surface rounded animate-pulse mb-2" />
            <div className="h-4 w-3/4 bg-bg-surface rounded animate-pulse mb-2" />
            <div className="h-4 w-1/2 bg-bg-surface rounded animate-pulse" />
          </div>

          <div className="border-t border-border pt-6 mt-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-4 w-16 bg-bg-surface rounded animate-pulse" />
              <div className="h-9 w-28 bg-bg-surface rounded-sm animate-pulse" />
            </div>
            <div className="h-11 w-full bg-bg-surface rounded-sm animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
