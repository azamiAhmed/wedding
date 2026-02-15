import { type Guest } from '@/lib/db/schema'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from './status-badge'
import { CopyLinkButton } from './copy-link-button'
import { DeleteGuestButton } from './delete-guest-button'

interface GuestTableProps {
  guests: Guest[]
}

export function GuestTable({ guests }: GuestTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Personnes</TableHead>
          <TableHead>Lien</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {guests.map((guest) => (
          <TableRow key={guest.id}>
            <TableCell className="font-medium text-brown-deep">
              {guest.lastName} {guest.firstName}
            </TableCell>
            <TableCell>
              <StatusBadge status={guest.status} />
            </TableCell>
            <TableCell className="text-brown-medium">
              {guest.status === 'confirmed'
                ? guest.personsConfirmed
                : '—'}
            </TableCell>
            <TableCell>
              <CopyLinkButton slug={guest.slug} />
            </TableCell>
            <TableCell>
              <DeleteGuestButton
                guestId={guest.id}
                guestName={`${guest.lastName} ${guest.firstName}`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
