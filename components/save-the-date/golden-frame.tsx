import type { ReactNode } from 'react'

/** Layout container for the Save the Date scene (name is historical — no visible frame). */
export function GoldenFrame({ children }: { children: ReactNode }) {
  return (
    <div className="golden-frame relative mx-auto flex min-h-[80dvh] w-[85%] flex-col justify-center lg:w-[70%]">
      {children}
    </div>
  )
}
