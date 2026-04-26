import Link from 'next/link'

export default function FamilyMembersPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold text-garden-wood mb-4">Manage family members</h1>
      <p className="text-garden-wood/80 mb-6">
        Add or remove authorized users after identity verification. Placeholder until accounts are linked to the
        database.
      </p>
      <Link href="/family" className="text-garden-sage-800 hover:text-garden-sage-900 font-medium">
        ← Back to family sharing
      </Link>
    </div>
  )
}
