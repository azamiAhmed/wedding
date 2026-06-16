export const COUPLE = {
  names: 'Ghizlaine & Ahmed',
  contactNames: 'Ghizlaine ou Ahmed',
  date: '2 Octobre 2026',
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

export const COLLAGE = {
  inviteLine1: 'Venez célébrer',
  inviteLine2: 'notre mariage',
  date: '02 Octobre 2026',
  city: 'Casablanca, Maroc',
  bride: 'Ghizlaine',
  groom: 'Ahmed',
  greeting: (name: string) => `Cher·e ${name}, ouvrez notre invitation`,
  programme: 'Programme',
  details: 'Les détails',
  rsvp: 'Confirmez votre présence',
  cta: 'cliquez ici',
  polaroidCaption: 'Nous deux',
  scrollHint: 'Découvrir',
  aria: {
    mariage: 'Voir la section Notre mariage',
    programme: 'Voir le programme',
    histoire: 'Voir notre histoire',
    infos: 'Voir les informations pratiques',
    rsvp: 'Confirmer votre présence',
  },
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
    date: '2 Octobre 2026',
    dateTime: '2026-10-02',
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
  mapsEmbedUrl: string
  mapsLinkUrl: string
}

export const VENUE: VenueInfo = {
  // TODO: remplacer par le vrai lieu de réception (placeholder présentable en attendant)
  name: 'Lieu de réception',
  address: 'Adresse communiquée prochainement',
  city: 'Casablanca, Maroc',
  description: 'Un lieu magique pour célébrer notre union.',
  details: [
    { label: 'Accès', value: 'Indications à venir' },
    { label: 'Parking', value: 'Parking disponible sur place' },
  ],
  // No-API-key Google Maps embed — replace the query with the venue address.
  mapsEmbedUrl: 'https://www.google.com/maps?q=Casablanca,Maroc&output=embed',
  mapsLinkUrl: 'https://www.google.com/maps/search/?api=1&query=Casablanca+Maroc',
}

export interface Hotel {
  name: string
  area: string
  url?: string
}

export const HOTELS: Hotel[] = [
  // Recommandations (à confirmer/ajuster) — hôtels réputés de Casablanca pour les invités
  {
    name: 'Four Seasons Casablanca',
    area: 'Corniche · Ain Diab',
    url: 'https://www.fourseasons.com/casablanca/',
  },
  {
    name: 'Hyatt Regency Casablanca',
    area: 'Place des Nations Unies · Centre',
    url: 'https://www.hyatt.com/hyatt-regency/en-US/casrc-hyatt-regency-casablanca',
  },
  {
    name: 'Hôtel Le Doge — Relais & Châteaux',
    area: 'Quartier Gauthier',
    url: 'https://www.hotelledoge.com/',
  },
]

export const METEO = {
  label: 'Météo',
  title: 'Début octobre à Casablanca',
  text: 'Des journées douces et ensoleillées (22–26°C) et des soirées plus fraîches au bord de l’océan. Prévoyez une étole ou une veste légère pour la soirée.',
} as const

export const LISTE_MARIAGE = {
  eyebrow: 'Votre présence avant tout',
  title: 'Liste de mariage',
  intro:
    'Votre présence à nos côtés est le plus précieux des cadeaux. Si vous souhaitez néanmoins nous gâter, vous pouvez participer à notre cagnotte pour notre voyage de noces.',
  buttonLabel: 'Participer à la cagnotte',
  // TODO: remplacer par le vrai lien de cagnotte (Leetchi, Lydia, ...)
  cagnotteUrl: '#',
} as const

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

export const OG = {
  title: 'Ghizlaine & Ahmed vous invitent',
  description:
    'Célébrez avec nous notre mariage le 2 Octobre 2026. Nous avons hâte de partager ce moment avec vous.',
} as const

export const SAVE_THE_DATE = {
  title: 'Ghizlaine & Ahmed',
  groom: 'Ahmed',
  bride: 'Ghizlaine',
  date: 'Le 2 octobre 2026',
  dateTime: '2026-10-02',
  city: 'À Casablanca, Maroc',
  messageLine1: 'Sous les étoiles et les lumières de Casablanca,',
  messageLine2: 'une promesse sera célébrée... Save the date !',
} as const

export const SAVE_THE_DATE_OG = {
  title: 'Ghizlaine & Ahmed \u2014 Save the Date',
  description: '2 Octobre 2026 \u00b7 Casablanca',
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
