import React from 'react'
import Link from 'next/link'

export function BrandBlocks() {
  return (
    <div className="section-padding xl:px-10!" style={{ paddingTop: 3 }}>
      <div className="flex flex-col md:flex-row gap-0.75">
        <div
          className="h-60 flex-1 w-full relative"
          style={{ maxWidth: '450px', background: 'linear-gradient(to right, #fbe1df, #ffffff)' }}
        >
          <img
            src="/logo/alibarbar-s.png"
            alt=""
            style={{ position: 'absolute', left: 30, top: 30 }}
          />
          <p
            className="text-black text-xs"
            style={{ position: 'absolute', left: 30, right: 160, top: 80 }}
          >
            Alibarbar was developed to fill the void where great taste meets function. Not a
            colourful youth targeted vape but a premium accessory to add to your daily lives.
          </p>
          <Link
            href="/brands/alibarbar"
            className="inline-flex items-center gap-1.5 bg-gold text-white font-bold text-lg rounded-full hover:opacity-80 transition-opacity"
            style={{
              position: 'absolute',
              left: 30,
              top: 190,
              padding: '5px 30px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
            }}
          >
            SHOP NOW <span>&rarr;</span>
          </Link>
          <img
            src="/assets/brand-alibarbar-s.png"
            alt=""
            style={{ position: 'absolute', right: 40, top: 100, transform: 'translateY(-50%)' }}
          />
        </div>
        <div
          className="h-60 flex-1 w-full relative"
          style={{ maxWidth: '450px', background: 'linear-gradient(to right, #e6dbec, #ffffff)' }}
        >
          <img
            src="/logo/snowplus-s.png"
            alt=""
            style={{ position: 'absolute', left: 30, top: 30 }}
          />
          <p
            className="text-black text-xs"
            style={{ position: 'absolute', left: 30, right: 160, top: 80 }}
          >
            Today, we proundly serve over 50,000 satisfied customers across Australia and
            internationally, offering two of the most acclaimed disposable vape lines in the world
          </p>
          <Link
            href="/brands/snowplus"
            className="inline-flex items-center gap-1.5 bg-black text-white font-bold text-lg rounded-full hover:opacity-80 transition-opacity"
            style={{
              position: 'absolute',
              left: 30,
              top: 190,
              padding: '5px 30px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
            }}
          >
            SHOP NOW <span>&rarr;</span>
          </Link>
          <img
            src="/assets/brand-snowplus-s.png"
            alt=""
            style={{ position: 'absolute', right: 40, top: 100, transform: 'translateY(-50%)' }}
          />
        </div>
        <div
          className="h-60 flex-1 w-full relative"
          style={{ maxWidth: '450px', background: 'linear-gradient(to right, #fae4d1, #ffffff)' }}
        >
          <img src="/logo/iget-s.png" alt="" style={{ position: 'absolute', left: 30, top: 30 }} />
          <p
            className="text-black text-xs"
            style={{ position: 'absolute', left: 30, right: 160, top: 80 }}
          >
            Every product we sell has been rigorously tested for quality, authenticity, and safety.
            We work directly with certified manufactureers and importers.
          </p>
          <Link
            href="/brands/iget"
            className="inline-flex items-center gap-1.5 bg-blue-600 text-white font-bold text-lg rounded-full hover:opacity-80 transition-opacity"
            style={{
              position: 'absolute',
              left: 30,
              top: 190,
              padding: '5px 30px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
            }}
          >
            SHOP NOW <span>&rarr;</span>
          </Link>
          <img
            src="/assets/brand-iget-s.png"
            alt=""
            style={{ position: 'absolute', right: 40, top: 100, transform: 'translateY(-50%)' }}
          />
        </div>
      </div>
    </div>
  )
}
