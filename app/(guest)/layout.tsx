import { SmoothSnapScroll } from '@/components/guest/smooth-snap-scroll'

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main
        className="guest-scroll-container h-dvh overflow-y-scroll snap-y snap-proximity lg:snap-none font-sans"
        style={{
          backgroundColor: '#FBF8F2',
          backgroundImage:
            "linear-gradient(rgba(251,248,242,0.5), rgba(251,248,242,0.5)), url('/images/fully_dynamique_bg.png')",
          backgroundSize: 'auto, 120% auto',
          backgroundRepeat: 'repeat, repeat-y',
          backgroundPosition: 'center, top center',
          backgroundAttachment: 'local, local',
        }}
      >
        {children}
      </main>
      <SmoothSnapScroll />
    </>
  )
}
