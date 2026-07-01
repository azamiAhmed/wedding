import { Badge } from '@/components/ui/badge'

const categoryConfig = {
  famille: { label: 'Famille', className: 'bg-mauve-deep/15 text-mauve-deep border-mauve-deep/30' },
  amis: { label: 'Amis', className: 'bg-gold-moroccan/15 text-gold-moroccan border-gold-moroccan/30' },
} as const

interface CategoryBadgeProps {
  category: string | null
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = category
    ? categoryConfig[category as keyof typeof categoryConfig]
    : undefined

  if (!config) return <span className="text-brown-medium">—</span>

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
