import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export type AuthenticatedUser = {
  id: string
  email: string
  name: string
  role: string
}

export type AuthHandler = (
  req: NextRequest,
  user: AuthenticatedUser,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>

export function withAuth(handler: AuthHandler) {
  return async (req: NextRequest, context?: { params: Record<string, string> }) => {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }
    const user: AuthenticatedUser = {
      id: session.user.id as string,
      email: session.user.email ?? '',
      name: session.user.name ?? '',
      role: (session.user as { role?: string }).role ?? 'viewer',
    }
    return handler(req, user, context)
  }
}
