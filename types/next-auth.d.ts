import 'next-auth'

declare module 'next-auth' {
  interface Session {
    role?: 'staff' | 'family'
  }
  interface User {
    id: string
    role?: 'staff' | 'family'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'staff' | 'family'
  }
}
