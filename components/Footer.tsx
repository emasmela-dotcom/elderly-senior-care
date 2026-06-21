const SUPPORT_EMAIL = 'apputilitybuilder@gmail.com'

export default function Footer() {
  return (
    <footer className="relative z-[1] border-t border-care-border bg-care-background/95">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-care-muted">
        <p>
          Support:{' '}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-medium text-care-primary underline underline-offset-2 hover:text-care-primary/90"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </footer>
  )
}
