import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const demoPassword = () =>
  process.env.AUTH_DEMO_PASSWORD?.trim() || 'demo'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim()
        const password = credentials?.password
        if (!email || !password) return null
        if (password !== demoPassword()) return null
        const role =
          credentials?.role === 'family' ? 'family' : 'staff'
        return {
          id: email,
          email,
          name: email,
          role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        if (user.email) token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string
      }
      session.role = token.role === 'family' ? 'family' : 'staff'
      return session
    },
  },
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
}
