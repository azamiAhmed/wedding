import { Badge } from '@/components/ui/badge'

const statusConfig = {
  confirmed: { label: 'Confirmé', className: 'bg-green-olive/15 text-green-olive border-green-olive/30' },
  pending: { label: 'En attente', className: 'bg-gold-moroccan/15 text-gold-moroccan border-gold-moroccan/30' },
  declined: { label: 'Décliné', className: 'bg-red-soft/15 text-red-soft border-red-soft/30' },
} as const

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.pending

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
