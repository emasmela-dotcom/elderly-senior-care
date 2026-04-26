import Link from 'next/link'

export default function FamilyPermissionsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold text-garden-wood mb-4">Privacy settings</h1>
      <p className="text-garden-wood/80 mb-6">
        Control which categories of data are visible to each family member. Placeholder for granular permissions.
      </p>
      <Link href="/family" className="text-garden-sage-800 hover:text-garden-sage-900 font-medium">
        ← Back to family sharing
      </Link>
    </div>
  )
}
