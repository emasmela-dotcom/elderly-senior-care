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
  const [role, setRole] = useState<'staff' | 'family'>('staff')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const res = await signIn('credentials', {
      email,
      password,
      role,
      redirect: false,
    })
    if (res?.error) {
      setError('Invalid email or password.')
      return
    }
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
        <p className="text-sm text-gray-600 mb-6">
          Use the demo password from <code className="text-gray-800">AUTH_DEMO_PASSWORD</code>{' '}
          (default <code className="text-gray-800">demo</code>).
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
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
              className="w-full border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
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
              className="w-full border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-900 mb-2">Account type</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-gray-900">
                <input
                  type="radio"
                  name="role"
                  value="staff"
                  checked={role === 'staff'}
                  onChange={() => setRole('staff')}
                />
                Staff
              </label>
              <label className="flex items-center gap-2 text-gray-900">
                <input
                  type="radio"
                  name="role"
                  value="family"
                  checked={role === 'family'}
                  onChange={() => setRole('family')}
                />
                Family (read-only)
              </label>
            </div>
          </div>
          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors font-medium"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
