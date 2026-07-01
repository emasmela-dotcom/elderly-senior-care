'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [callbackUrl, setCallbackUrl] = useState('/')

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    setCallbackUrl(q.get('callbackUrl') || '/')
  }, [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const res = await signIn('credentials', {
      email,
      password,
      role: 'staff',
      redirect: false,
    })
    if (res?.error) {
      setError('That email or password did not work. Try again or use Support in the footer.')
      return
    }
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-garden-sage-200/65 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-garden-wood mb-1">Sign in to your account</h1>
        <p className="text-sm text-garden-wood/75 mb-6">
          Enter your email and password to save your medications, appointments, and schedule.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-garden-wood mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood focus:ring-2 focus:ring-garden-sage-500 focus:border-garden-sage-600"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-garden-wood mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood focus:ring-2 focus:ring-garden-sage-500 focus:border-garden-sage-600"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full py-3 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors font-medium text-base min-h-[48px]"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
