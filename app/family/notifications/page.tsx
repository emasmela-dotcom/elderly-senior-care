import Link from 'next/link'

export default function FamilyNotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Notification preferences</h1>
      <p className="text-gray-700 mb-6">
        Configure alerts when integrated with email or SMS providers. Placeholder until notification rules are stored.
      </p>
      <Link href="/family" className="text-blue-700 hover:text-blue-900 font-medium">
        ← Back to family sharing
      </Link>
    </div>
  )
}
