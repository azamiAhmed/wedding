export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div
        className="hidden lg:block fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/rings/arriere plan 2.jpg')" }}
        aria-hidden="true"
      />
      <main className="guest-scroll-container h-dvh overflow-y-scroll snap-y snap-mandatory landscape:snap-none landscape:overflow-y-auto bg-cream-warm lg:bg-transparent font-sans">
        {children}
      </main>
    </>
  )
}
