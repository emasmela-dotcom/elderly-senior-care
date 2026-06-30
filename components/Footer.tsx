import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative z-[1] border-t border-care-border bg-care-background/95">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-care-muted space-y-2">
        <p className="text-care-text">© 2026 careconnect-24-7</p>
        <p>
          <Link
            href="/support"
            className="font-medium text-care-primary underline underline-offset-2 hover:text-care-primary/90"
          >
            Support
          </Link>
        </p>
      </div>
    </footer>
  )
}
