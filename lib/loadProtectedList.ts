export type ListLoadResult<T> = {
  items: T[]
  error: string
}

/** Guests get an empty list (no error). Signed-in users get data or a real error. */
export async function loadProtectedList<T>(url: string): Promise<ListLoadResult<T>> {
  try {
    const res = await fetch(url, { credentials: 'same-origin' })
    if (res.status === 401) return { items: [], error: '' }
    const data: unknown = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        items: [],
        error: (data as { error?: string }).error ?? 'Could not load',
      }
    }
    return { items: Array.isArray(data) ? (data as T[]) : [], error: '' }
  } catch {
    return { items: [], error: 'Network error' }
  }
}
