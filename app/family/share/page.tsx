import Link from 'next/link'

export default function FamilySharePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold text-garden-wood mb-4">Share health data</h1>
      <p className="text-garden-wood/80 mb-6">
        Grant access only with documented consent from the resident or authorized representative. This screen is a
        placeholder for a future guided sharing flow.
      </p>
      <Link href="/family" className="text-garden-sage-800 hover:text-garden-sage-900 font-medium">
        ← Back to family sharing
      </Link>
    </div>
  )
}
