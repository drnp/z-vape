import React from 'react'
import Link from 'next/link'

interface BrandBlockData {
  href: string
  logo: string
  blurb: string
  productImg: string
  background: string
  buttonClass: string
}

const blocks: BrandBlockData[] = [
  {
    href: '/brands/alibarbar',
    logo: '/logo/alibarbar-s.png',
    blurb:
      'Alibarbar was developed to fill the void where great taste meets function. Not a colourful youth targeted vape but a premium accessory to add to your daily lives.',
    productImg: '/assets/brand-alibarbar-s.png',
    background: 'linear-gradient(to right, #fbe1df, #ffffff)',
    buttonClass: 'bg-gold text-white',
  },
  {
    href: '/brands/snowplus',
    logo: '/logo/snowplus-s.png',
    blurb:
      'Today, we proundly serve over 50,000 satisfied customers across Australia and internationally, offering two of the most acclaimed disposable vape lines in the world',
    productImg: '/assets/brand-snowplus-s.png',
    background: 'linear-gradient(to right, #e6dbec, #ffffff)',
    buttonClass: 'bg-black text-white',
  },
  {
    href: '/brands/iget',
    logo: '/logo/iget-s.png',
    blurb:
      'Every product we sell has been rigorously tested for quality, authenticity, and safety. We work directly with certified manufactureers and importers.',
    productImg: '/assets/brand-iget-s.png',
    background: 'linear-gradient(to right, #fae4d1, #ffffff)',
    buttonClass: 'bg-blue-600 text-white',
  },
]

const buttonBaseClass =
  'items-center gap-1.5 rounded-full font-bold text-lg hover:opacity-80 transition-opacity'

function BrandBlock({ block }: { block: BrandBlockData }) {
  return (
    <div
      className="relative flex-1 w-full overflow-hidden md:h-60"
      style={{ maxWidth: '450px', background: block.background }}
    >
      {/* Mobile: stacked layout */}
      <div className="px-8 pt-8 pb-8 flex flex-col gap-4 md:hidden">
        <div className="flex items-center justify-between">
          <img src={block.logo} alt="" className="h-8 w-auto" />
          <img
            src={block.productImg}
            alt=""
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
      <img
        src={block.logo}
        alt=""
        className="hidden md:block md:absolute md:left-[30px] md:top-[30px]"
      />
      <p className="hidden md:block text-black text-xs md:absolute md:left-[30px] md:right-[160px] md:top-[80px]">
        {block.blurb}
      </p>
      <Link
        href={block.href}
        className={`hidden md:inline-flex ${buttonBaseClass} ${block.buttonClass} md:absolute md:left-[30px] md:top-[190px]`}
        style={{ padding: '5px 30px', boxShadow: '0 4px 16px rgba(0,0,0,0.35)' }}
      >
        SHOP NOW <span>&rarr;</span>
      </Link>
      <img
        src={block.productImg}
        alt=""
        className="hidden md:block md:absolute md:right-[40px] md:top-[100px] md:-translate-y-1/2"
      />
    </div>
  )
}

export function BrandBlocks() {
  return (
    <div className="section-padding xl:px-10!" style={{ paddingTop: 3 }}>
      <div className="flex flex-col md:flex-row gap-0.75">
        {blocks.map((block) => (
          <BrandBlock key={block.href} block={block} />
        ))}
      </div>
    </div>
  )
}
