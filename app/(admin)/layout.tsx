export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="px-4 sm:px-8 py-8 font-sans">
      {children}
    </div>
  )
}
