import Link from 'next/link'

const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE?.trim() ?? ''

export default function Footer() {
  const phoneHref = supportPhone ? `tel:${supportPhone.replace(/\s/g, '')}` : ''

  return (
    <footer className="relative z-[1] border-t border-care-border px-5 py-8 text-center md:px-8">
      <p className="text-xs tracking-wide text-care-muted">
        © 2026 careconnect-24-7
      </p>
      <p className="mt-2 text-xs text-care-text">
        <Link
          href="/support"
          className="text-care-primary hover:text-care-primary/90 hover:underline"
        >
          Contact support
        </Link>
      </p>
      {phoneHref ? (
        <p className="mt-2 text-xs text-care-text">
          <a
            href={phoneHref}
            className="text-care-primary hover:text-care-primary/90 hover:underline"
          >
            Call for help
          </a>
        </p>
      ) : null}
    </footer>
  )
}
