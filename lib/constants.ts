export const COUPLE = {
  names: 'Ahmed & Ghizlaine',
  contactNames: 'Ahmed ou Ghizlaine',
  date: '17 Octobre 2026',
  inviteText: 'Vous êtes cordialement invité(e)',
  greeting: (name: string) => `${name}, vous êtes attendu(e)`,
  message: 'Nous avons le plaisir de vous convier à célébrer notre union.',
  submessage: 'Votre présence est le plus beau des cadeaux.',
  infoTitle: 'Nous nous marions',
  timelineTitle: 'Notre Histoire',
  venueTitle: 'Lieu de la Cérémonie',
  programTitle: 'Programme de la Journée',
  merciTitle: 'Merci',
  merciMessage: 'Votre présence est notre plus belle bénédiction.',
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

interface VenueDetail {
  label: string
  value: string
}

export interface VenueInfo {
  name: string
  address: string
  city: string
  description: string
  details: VenueDetail[]
}

export const VENUE: VenueInfo = {
  name: 'Nom du lieu',
  address: '123 Rue Example',
  city: 'Ville, Maroc',
  description: 'Un lieu magique pour célébrer notre union.',
  details: [
    { label: 'Accès', value: 'Indications à venir' },
    { label: 'Parking', value: 'Parking disponible sur place' },
  ],
}

export interface ProgramEvent {
  title: string
  description: string
  icon: 'welcome' | 'ceremony' | 'cocktail' | 'dinner' | 'dance'
}

export const RSVP = {
  confirmButton: 'Confirmer ma présence',
  modifyButton: 'Modifier ma réponse',
  ariaConfirm: 'Ouvrir formulaire RSVP',
  ariaModify: 'Modifier réponse RSVP',
  overlayTitle: 'Confirmez votre présence',
  guestLabel: 'Invité',
  stepperLabel: 'Nous serons',
  confirmAction: 'Je serai là',
  declineAction: 'Je ne pourrai pas',
  successMessage: 'On a hâte de vous voir !',
  declineMessage: 'Nous comprenons, vous nous manquerez',
  loadingText: 'Confirmation...',
  errorText: 'Un souci temporaire. Réessayez.',
  statusConfirmed: (n: number) =>
    `Vous avez confirmé pour ${n} personne${n > 1 ? 's' : ''}`,
  statusDeclined: "Vous avez décliné l'invitation",
  modifyStatusAction: 'Modifier',
} as const

export const LANDING = {
  title: 'Ahmed & Ghizlaine',
  message:
    'Ce site est réservé aux invités d\'Ahmed & Ghizlaine. Si vous souhaitez recevoir votre invitation, n\'hésitez pas à les contacter.',
} as const

export const OG = {
  title: 'Ahmed & Ghizlaine vous invitent',
  description:
    'Célébrez avec nous notre mariage le 17 Octobre 2026. Nous avons hâte de partager ce moment avec vous.',
} as const

export const PROGRAM_EVENTS: ProgramEvent[] = [
  {
    title: 'Accueil des invités',
    description: 'Réception chaleureuse.',
    icon: 'welcome',
  },
  {
    title: 'Cérémonie',
    description: 'Célébration de notre union.',
    icon: 'ceremony',
  },
  {
    title: 'Cocktail',
    description: 'Convivialité et partage.',
    icon: 'cocktail',
  },
  {
    title: 'Dîner',
    description: 'Un festin pour les papilles.',
    icon: 'dinner',
  },
  {
    title: 'Soirée dansante',
    description: 'Place à la fête !',
    icon: 'dance',
  },
]
