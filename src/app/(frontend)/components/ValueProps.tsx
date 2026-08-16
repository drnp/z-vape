import React from 'react'

const props = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: 'Fast AU Shipping',
    desc: 'Free express delivery on orders over $99.',
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: '100% Authentic',
    desc: 'Sourced directly from authorised distributors.',
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Age Verified',
    desc: 'Strictly 18+ on all orders. AU compliant.',
  },
]

export function ValueProps() {
  return (
    <section className="py-12 md:py-16 border-y border-border">
      <div className="section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {props.map((item) => (
            <div
              key={item.title}
              className="flex md:flex-col md:text-center items-start md:items-center gap-4 md:gap-0"
            >
              <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-gold md:mb-4">
                {item.icon}
              </div>
              <div>
                <h3 className="font-heading text-sm md:text-base mb-1">{item.title}</h3>
                <p className="text-text-secondary text-xs md:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
