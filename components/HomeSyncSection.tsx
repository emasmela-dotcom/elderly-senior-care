'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Link2, Upload, RefreshCw } from 'lucide-react'
import {
  SYNC_CATALOG,
  SYNC_CATEGORY_LABELS,
  type SyncCategory,
  type SyncCatalogItem,
} from '@/lib/syncCatalog'

const CATEGORY_ORDER: SyncCategory[] = [
  'appointments',
  'medications',
  'vitals',
  'health_records',
]

function MethodBadge({ item }: { item: SyncCatalogItem }) {
  const Icon = item.method === 'connect' ? Link2 : Upload
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-care-border bg-care-hover px-2.5 py-0.5 text-xs font-medium text-care-text">
      <Icon className="h-3 w-3 shrink-0 text-care-primary" aria-hidden />
      {item.methodLabel}
    </span>
  )
}

export function HomeSyncSection() {
  const { data: session } = useSession()

  const byCategory = CATEGORY_ORDER.map((category) => ({
    category,
    label: SYNC_CATEGORY_LABELS[category],
    items: SYNC_CATALOG.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <section
      className="garden-surface mb-10 p-6 md:p-8"
      aria-labelledby="home-sync-heading"
    >
      <h2
        id="home-sync-heading"
        className="font-display text-2xl font-semibold text-care-text md:text-3xl"
      >
        Bring what you already use
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-care-muted">
        If you already track health info in other apps, you can bring it into CareConnect 24/7
        after you sign up — no re-typing. Connect an account or upload a file from your phone
        or computer.
      </p>

      <div className="mt-8 space-y-8">
        {byCategory.map((group) => (
          <div key={group.category}>
            <h3 className="font-display text-lg font-semibold text-care-text">
              {group.label}
            </h3>
            <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-garden border border-care-border bg-white/90 px-4 py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold text-care-text">{item.name}</p>
                    <MethodBadge item={item} />
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-care-muted">
                    {item.bringsIn}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {session ? (
          <Link href="/sync" className="garden-btn inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" aria-hidden />
            Sync your apps
          </Link>
        ) : (
          <>
            <Link href="/login" className="garden-btn">
              Sign in to sync
            </Link>
            <Link href="/sync" className="garden-btn-outline">
              See how sync works
            </Link>
            <Link href="/pricing" className="garden-btn-outline">
              See pricing
            </Link>
          </>
        )}
      </div>
    </section>
  )
}
