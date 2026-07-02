const REFRESH_URL = 'https://oauth2.googleapis.com/token'

export async function refreshGoogleAccessToken(
  refreshToken: string
): Promise<string | null> {
  try {
    const res = await fetch(REFRESH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })
    const data = (await res.json()) as { access_token?: string }
    return data.access_token ?? null
  } catch {
    return null
  }
}

export function googleRedirectUri(path: string): string {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  return `${baseUrl}${path}`
}
