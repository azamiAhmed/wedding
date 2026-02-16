import Image from "next/image"

export function AllianceRings() {
  return (
    <div
      className="alliance-rings-container fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    >
      <Image
        className="alliance-ring-left"
        src="/images/rings/solitaire-blanc.png"
        alt=""
        width={120}
        height={180}
        priority={false}
      />
      <Image
        className="alliance-ring-right"
        src="/images/rings/bague-homme.png"
        alt=""
        width={120}
        height={180}
        priority={false}
      />
    </div>
  )
}
