import React from 'react'

const iconRow1 = [
  { src: '/icon/genuine.png', label: '100% Genuine' },
  { src: '/icon/dispatch.png', label: 'Quick Dispatch' },
  { src: '/icon/delivery.png', label: 'Delivery Service' },
  { src: '/icon/secure.png', label: 'Secure Payment' },
]

const socialIcons = [
  {
    label: 'Facebook',
    path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  },
  {
    label: 'Twitter',
    path: 'M4 4l12 16h4L8 4H4zm6.5 1.5L18 20h-3L6.5 5.5h4z',
  },
  {
    label: 'Instagram',
    path: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm4.5-4.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z',
  },
  {
    label: 'Youtube',
    path: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  },
]

export function IconBlanks() {
  return (
    <>
      <div className="section-padding xl:px-10! h-100 flex items-center justify-center">
        {/* Layer 1 */}
        <div className="flex justify-center gap-20 md:gap-32">
          {iconRow1.map(({ src, label }) => (
            <div key={label} className="w-40 flex flex-col items-center gap-3">
              <div className="w-full h-40 flex items-center justify-center">
                <img src={src} alt={label} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="h-8 flex items-center">
                <span className="text-gold text-xl font-medium whitespace-nowrap">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-padding xl:px-10! h-px bg-gold my-8 md:my-12" />

      <div className="section-padding xl:px-10! h-30 flex items-center justify-center">
        {/* Layer 2 */}
        <div className="flex justify-center gap-20 md:gap-32">
          {socialIcons.map(({ label, path }) => (
            <div
              key={label}
              className="w-12 h-12 rounded-full bg-gold flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={path} />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
