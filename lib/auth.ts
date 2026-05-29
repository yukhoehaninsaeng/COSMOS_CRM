import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? 'fallback-dev-secret-not-for-production',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user || !user.isActive || !user.passwordHash) return null
        const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!isValid) return null
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
        return { id: user.id, email: user.email, name: user.name ?? '', role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
})

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'member' | 'viewer'

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 5,
  admin: 4,
  manager: 3,
  member: 2,
  viewer: 1,
}

export function hasRole(userRole: string, requiredRole: UserRole): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as UserRole] ?? 0
  return userLevel >= ROLE_HIERARCHY[requiredRole]
}
