import { Suspense } from 'react'
import PricingPage from './PricingClient'

export default function Page() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-14 text-center text-care-muted">Loading…</div>}>
      <PricingPage />
    </Suspense>
  )
}
