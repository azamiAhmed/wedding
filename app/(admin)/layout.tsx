export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-8 py-8 font-sans">
      {children}
    </div>
  )
}
