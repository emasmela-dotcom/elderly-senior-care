import Link from 'next/link'

export default function FamilyNotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold text-garden-wood mb-4">Notification preferences</h1>
      <p className="text-garden-wood/80 mb-6">
        Configure alerts when integrated with email or SMS providers. Placeholder until notification rules are stored.
      </p>
      <Link href="/family" className="text-garden-sage-800 hover:text-garden-sage-900 font-medium">
        ← Back to family sharing
      </Link>
    </div>
  )
}
