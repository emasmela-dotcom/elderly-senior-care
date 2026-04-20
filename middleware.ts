export { default } from 'next-auth/middleware'

/** Pages only: APIs use `requireSession` per route (middleware cannot run on `/api/*` or it breaks JSON clients). */
export const config = {
  matcher: [
    '/((?!api/|login|_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
