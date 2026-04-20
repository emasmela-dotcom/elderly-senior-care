import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

let cached: NeonQueryFunction<false, false> | null = null

/** Neon serverless SQL client (Postgres). Requires DATABASE_URL from the Neon dashboard. */
export function getSql(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL
  if (!url?.trim()) {
    throw new Error('DATABASE_URL is not set')
  }
  if (!cached) {
    cached = neon(url)
  }
  return cached
}
