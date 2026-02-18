import type { ReactNode } from 'react'

function CornerArabesque({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Geometric arabesque corner — interlacing lines inspired by Islamic zellige */}
      <path
        d="M0 1C16 1 20 4 24 8C28 12 30 18 30 24"
        stroke="#D4A54A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M1 0C1 16 4 20 8 24C12 28 18 30 24 30"
        stroke="#D4A54A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M0 6C10 6 14 8 18 12C22 16 24 22 24 24"
        stroke="#D4A54A"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M6 0C6 10 8 14 12 18C16 22 22 24 24 24"
        stroke="#D4A54A"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Small decorative diamond at the intersection */}
      <path
        d="M10 10L13 7L16 10L13 13Z"
        stroke="#D4A54A"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  )
}

export function GoldenFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-[80dvh] w-[85%] flex-col justify-center border border-gold-moroccan lg:w-[70%]">
      {/* Corner arabesques — mirrored via scale transforms */}
      <CornerArabesque className="absolute -left-px -top-px h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
      <CornerArabesque className="absolute -right-px -top-px h-6 w-6 -scale-x-100 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
      <CornerArabesque className="absolute -bottom-px -left-px h-6 w-6 -scale-y-100 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
      <CornerArabesque className="absolute -bottom-px -right-px h-6 w-6 -scale-100 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />

      {/* Content rendered inside the frame */}
      {children}
    </div>
  )
}
