'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { RefreshCw } from 'lucide-react'
import { SyncPanel } from '@/components/SyncPanel'
import { PharmacyImportPanel } from '@/components/PharmacyImportPanel'
import { VitalsImportPanel } from '@/components/VitalsImportPanel'
import { EpicMyChartPanel } from '@/components/EpicMyChartPanel'
import { HomeSyncSection } from '@/components/HomeSyncSection'

export default function SyncPage() {
  const { data: session } = useSession()

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <header className="mb-8 max-w-3xl">
        <h1 className="font-display text-3xl font-semibold text-care-text md:text-4xl">
          Sync your apps
        </h1>
        <p className="mt-3 text-base leading-relaxed text-care-muted">
          Connect or upload from every app CareConnect supports — all in one place.
        </p>
      </header>

      {!session ? (
        <>
          <div className="mb-8 rounded-garden border border-care-border bg-white/95 p-5 text-center">
            <p className="text-base text-care-text">
              <RefreshCw className="mx-auto mb-3 h-8 w-8 text-care-primary" aria-hidden />
              Sign in to connect Google Calendar, Google Fit, MyChart, and upload files from
              Apple Health, your pharmacy, and more.
            </p>
            <Link href="/login" className="garden-btn mt-4 inline-block">
              Sign in to sync
            </Link>
          </div>
          <HomeSyncSection />
        </>
      ) : (
        <div className="max-w-3xl space-y-2">
          <div id="appointments">
            <SyncPanel defaultOpen />
          </div>
          <div id="medications">
            <PharmacyImportPanel />
          </div>
          <div id="vitals">
            <VitalsImportPanel />
          </div>
          <div id="mychart">
            <EpicMyChartPanel />
          </div>
        </div>
      )}
    </div>
  )
}
