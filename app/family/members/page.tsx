import Link from 'next/link'

export default function FamilyMembersPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Manage family members</h1>
      <p className="text-gray-700 mb-6">
        Add or remove authorized users after identity verification. Placeholder until accounts are linked to the
        database.
      </p>
      <Link href="/family" className="text-blue-700 hover:text-blue-900 font-medium">
        ← Back to family sharing
      </Link>
    </div>
  )
}
