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
  venueTitle: 'Lieu de la cérémonie',
  programTitle: 'Programme de la soirée',
  merciTitle: 'Merci',
  merciMessage: 'Votre présence sera notre plus grande joie.',
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

export const INVITATION = {
  eyebrow: "Carte d'invitation",
  greeting: (name: string) => `Cher/Chère ${name}`,
  body:
    "Nous avons la joie de vous convier à la célébration de notre mariage le vendredi 02 octobre 2026, à Casablanca. C'est avec une grande émotion que nous nous apprêtons à unir nos vies, entourés de ceux qui comptent le plus pour nous. Votre présence à nos côtés serait pour nous un immense bonheur et rendrait cette soirée encore plus belle et inoubliable.",
  closing: 'Avec toute notre affection,',
  signature: 'Ghizlaine & Ahmed',
} as const

export const COUNTDOWN = {
  eyebrow: 'Plus que',
  title: 'avant le grand jour',
  intro:
    'Chaque jour qui passe nous rapproche du plus beau « oui » de notre vie, et avec lui la joie de vous retrouver à nos côtés.',
} as const

export const STORY = {
  title: 'Notre histoire',
  paragraphs: [
    'Il y a des rencontres qui arrivent comme une évidence, des regards qui marquent, des moments simples qui deviennent précieux, et des histoires qui grandissent doucement, jour après jour.',
    "Notre histoire a grandi doucement, portée par des moments simples, des liens sincères et cette certitude, de plus en plus forte, d'avoir trouvé l'un en l'autre une évidence.",
    'Tous ces instants nous ont menés à une étape inoubliable : nos fiançailles, le 17 janvier 2026.',
    'Depuis ce jour, nous avançons avec émotion vers ce grand moment où nous avons choisi de nous dire « oui ».',
    "Aujourd'hui, c'est entourés de ceux que nous aimons que nous nous apprêtons à écrire le plus beau chapitre de notre vie.",
  ],
  photoCaption: 'Nous deux',
} as const

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
  name: 'Layali Palace',
  address: 'À Bouskoura (banlieue proche de Casablanca)',
  city: 'G94M+4H5, Bouskoura, Maroc',
  description: '',
  details: [
    {
      label: 'Parking',
      value:
        'Un parking dédié aux invités est disponible à l’entrée de la salle des fêtes.',
    },
    {
      label: 'Navette',
      value: 'Une navette sera mise à disposition de nos invités venus de loin.',
    },
  ],
  mapsEmbedUrl: 'https://www.google.com/maps?q=G94M%2B4H5,Bouskoura,Maroc&output=embed',
  mapsLinkUrl: 'https://www.google.com/maps/search/?api=1&query=G94M%2B4H5%2CBouskoura%2CMaroc',
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
  title: 'Cagnotte de mariage',
  intro: [
    'Votre présence à nos côtés sera déjà le plus beau des cadeaux.',
    'Si toutefois vous souhaitez nous témoigner une attention supplémentaire, une cagnotte sera mise à votre disposition afin de nous accompagner dans nos premiers projets à deux et dans la suite de cette belle aventure.',
  ],
  buttonLabel: 'Participer à la cagnotte',
  // TODO: remplacer par le vrai lien de cagnotte (Leetchi, Lydia, ...)
  cagnotteUrl: '#',
} as const

export interface ProgramEvent {
  title: string
  description: string
  icon: 'welcome' | 'ceremony' | 'tradition' | 'dinner' | 'cake' | 'dance'
  time?: string
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
    time: '18h00',
    title: 'Accueil des invités',
    description:
      'Ouverture de la soirée et accueil de nos proches dans une ambiance chaleureuse.',
    icon: 'welcome',
  },
  {
    title: "Première entrée & signature de l'acte",
    description:
      "Nous ferons notre entrée dans la salle pour partager avec vous les premiers instants de cette célébration, suivi d'un moment fort et symbolique, entourés de nos familles et de nos proches.",
    icon: 'ceremony',
  },
  {
    title: 'Entrée en tenue traditionnelle',
    description:
      "Un clin d'œil à nos origines et à nos traditions, dans une ambiance festive et pleine d'émotion.",
    icon: 'tradition',
  },
  {
    title: 'Dîner & célébration',
    description:
      'Un temps de partage, de musique et de joie autour de ceux que nous aimons.',
    icon: 'dinner',
  },
  {
    title: 'Robe blanche & pièce montée',
    description:
      'Un moment symbolique et inoubliable autour de la coupe de la pièce montée.',
    icon: 'cake',
  },
  {
    title: 'Place à la fête',
    description:
      'La soirée se poursuivra en musique, en danse et en souvenirs inoubliables.',
    icon: 'dance',
  },
]
