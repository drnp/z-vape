import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface BrandBlockData {
  href: string
  logo: string
  logoWidth: number
  logoHeight: number
  blurb: string
  productImg: string
  productWidth: number
  productHeight: number
  background: string
  buttonClass: string
}

const blocks: BrandBlockData[] = [
  {
    href: '/brands/alibarbar',
    logo: '/logo/alibarbar-s.png',
    logoWidth: 172,
    logoHeight: 40,
    blurb:
      'Alibarbar was developed to fill the void where great taste meets function. Not a colourful youth targeted vape but a premium accessory to add to your daily lives.',
    productImg: '/assets/brand-alibarbar-s.png',
    productWidth: 109,
    productHeight: 240,
    background: 'linear-gradient(to right, #fbe1df, #ffffff)',
    buttonClass: 'bg-gold text-white',
  },
  {
    href: '/brands/snowplus',
    logo: '/logo/snowplus-s.png',
    logoWidth: 168,
    logoHeight: 40,
    blurb:
      'Today, we proundly serve over 50,000 satisfied customers across Australia and internationally, offering two of the most acclaimed disposable vape lines in the world',
    productImg: '/assets/brand-snowplus-s.png',
    productWidth: 77,
    productHeight: 240,
    background: 'linear-gradient(to right, #e6dbec, #ffffff)',
    buttonClass: 'bg-black text-white',
  },
  // IGET 已停用（恢复时取消注释）
  // {
  //   href: '/brands/iget',
  //   logo: '/logo/iget-s.png',
  //   logoWidth: 152,
  //   logoHeight: 40,
  //   blurb:
  //     'Every product we sell has been rigorously tested for quality, authenticity, and safety. We work directly with certified manufactureers and importers.',
  //   productImg: '/assets/brand-iget-s.png',
  //   productWidth: 86,
  //   productHeight: 240,
  //   background: 'linear-gradient(to right, #fae4d1, #ffffff)',
  //   buttonClass: 'bg-blue-600 text-white',
  // },
]

const buttonBaseClass =
  'items-center gap-1.5 rounded-full font-bold text-lg hover:opacity-80 transition-opacity'

function BrandBlock({ block }: { block: BrandBlockData }) {
  return (
    <div
      className="relative flex-1 w-full overflow-hidden md:h-60"
      style={{ maxWidth: '600px', background: block.background }}
    >
      {/* Mobile: stacked layout */}
      <div className="px-8 pt-8 pb-8 flex flex-col gap-4 md:hidden">
        <div className="flex items-center justify-between">
          <Image
            src={block.logo}
            alt=""
            width={block.logoWidth}
            height={block.logoHeight}
            sizes="160px"
            className="h-8 w-auto"
          />
          <Image
            src={block.productImg}
            alt=""
            width={block.productWidth}
            height={block.productHeight}
            sizes="64px"
            className="h-16 w-auto object-contain"
          />
        </div>
        <p className="text-black text-xs leading-relaxed">{block.blurb}</p>
        <Link
          href={block.href}
          className={`md:hidden inline-flex ${buttonBaseClass} ${block.buttonClass} w-full justify-center`}
          style={{ padding: '8px 30px', boxShadow: '0 4px 16px rgba(0,0,0,0.35)' }}
        >
          SHOP NOW <span>&rarr;</span>
        </Link>
      </div>

      {/* Desktop: original absolute-positioned layout */}
      <Image
        src={block.logo}
        alt=""
        width={block.logoWidth}
        height={block.logoHeight}
        sizes="172px"
        className="hidden md:block md:absolute md:left-7.5 md:top-7.5"
      />
      <p className="hidden md:block text-black text-xs md:absolute md:left-7.5 md:right-40 md:top-20">
        {block.blurb}
      </p>
      <Link
        href={block.href}
        className={`hidden md:inline-flex ${buttonBaseClass} ${block.buttonClass} md:absolute md:left-7.5 md:top-47.5`}
        style={{ padding: '5px 30px', boxShadow: '0 4px 16px rgba(0,0,0,0.35)' }}
      >
        SHOP NOW <span>&rarr;</span>
      </Link>
      <Image
        src={block.productImg}
        alt=""
        width={block.productWidth}
        height={block.productHeight}
        sizes="120px"
        className="hidden md:block md:absolute md:right-10 md:top-25 md:-translate-y-1/2"
      />
    </div>
  )
}

export function BrandBlocks() {
  return (
    <div className="section-padding xl:px-10!" style={{ paddingTop: 3 }}>
      <div className="flex flex-col md:flex-row md:justify-center gap-0.75">
        {blocks.map((block) => (
          <BrandBlock key={block.href} block={block} />
        ))}
      </div>
    </div>
  )
}
