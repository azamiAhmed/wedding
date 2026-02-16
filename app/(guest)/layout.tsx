export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="guest-scroll-container h-dvh overflow-y-scroll snap-y snap-mandatory landscape:snap-none landscape:overflow-y-auto bg-cream-warm font-sans">
      {children}
    </main>
  )
}
