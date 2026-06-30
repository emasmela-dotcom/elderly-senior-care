import Link from 'next/link'
import { SupportForm } from '@/components/SupportForm'

export const metadata = {
  title: 'Support | CareConnect 24/7',
  description: 'Contact CareConnect support.',
}

export default function SupportPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white border border-garden-sage-200/65 p-8 shadow-sm">
        <nav className="mb-6 text-sm">
          <Link href="/" className="font-medium text-care-primary underline underline-offset-2 hover:text-care-primary/90">
            Home
          </Link>
        </nav>

        <header className="mb-6 border-b border-garden-clay-200/85 pb-4">
          <p className="text-sm font-medium text-care-primary">Support</p>
          <h1 className="text-2xl font-bold text-garden-wood mt-1">Contact us</h1>
          <p className="text-sm text-garden-wood/75 mt-2 leading-relaxed">
            Send a message from here — your email app will not open. We&apos;ll reply to the address you enter below.
          </p>
        </header>

        <SupportForm />
      </div>
    </div>
  )
}
