import Link from 'next/link'

export default function FamilyPermissionsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy settings</h1>
      <p className="text-gray-700 mb-6">
        Control which categories of data are visible to each family member. Placeholder for granular permissions.
      </p>
      <Link href="/family" className="text-blue-700 hover:text-blue-900 font-medium">
        ← Back to family sharing
      </Link>
    </div>
  )
}
