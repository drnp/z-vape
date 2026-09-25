import React from 'react'
import Image from 'next/image'

export function BannerSection() {
  return (
    <div className="section-padding" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <Image
        src="/assets/banner-01.jpg"
        alt=""
        width={1920}
        height={1080}
        priority
        sizes="100vw"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
  )
}
