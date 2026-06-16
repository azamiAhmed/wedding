import { SmoothSnapScroll } from '@/components/guest/smooth-snap-scroll'

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div
        className="hidden lg:block fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/collage/paper-texture.webp')" }}
        aria-hidden="true"
      />
      <main className="guest-scroll-container h-dvh overflow-y-scroll snap-y snap-mandatory md:snap-none bg-cream-warm lg:bg-transparent font-sans">
        {children}
      </main>
      <SmoothSnapScroll />
    </>
  )
}
