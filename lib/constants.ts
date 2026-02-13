export const COUPLE = {
  names: 'Ahmed & Ghizlaine',
  contactNames: 'Ahmed ou Ghizlaine',
  date: '17 Octobre 2026',
  inviteText: 'Vous êtes cordialement invité(e)',
  greeting: (name: string) => `${name}, vous êtes attendu(e)`,
  message: 'Nous avons le plaisir de vous convier à célébrer notre union.',
  submessage: 'Votre présence est le plus beau des cadeaux.',
  timelineTitle: 'Notre Histoire',
  venueTitle: 'Lieu de la Cérémonie',
  venueText: 'Les détails du lieu seront communiqués prochainement.',
  programTitle: 'Programme de la Journée',
  programText: 'Le programme détaillé sera partagé prochainement.',
} as const

export interface TimelineEvent {
  date: string
  dateTime: string
  title: string
  description: string
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    date: '24 Avril 2025',
    dateTime: '2025-04-24',
    title: 'La Rencontre',
    description:
      'Le début de notre histoire, un moment inattendu qui a tout changé.',
  },
  {
    date: '17 Janvier 2026',
    dateTime: '2026-01-17',
    title: 'Les Fiançailles',
    description:
      'Le « oui » qui scelle notre promesse, une évidence depuis le premier jour.',
  },
  {
    date: '17 Octobre 2026',
    dateTime: '2026-10-17',
    title: 'Le Jour J',
    description:
      'Le plus beau chapitre commence, entourés de ceux que nous aimons.',
  },
]
