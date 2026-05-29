import { auth } from '@/lib/auth'
import { hasRole, UserRole } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import type { AuthenticatedUser, AuthHandler } from './withAuth'

export function withRole(role: UserRole, handler: AuthHandler) {
  return async (req: NextRequest, context?: { params: Record<string, string> }) => {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }
    const userRole = (session.user as { role?: string }).role ?? 'viewer'
    if (!hasRole(userRole, role)) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    }
    const user: AuthenticatedUser = {
      id: session.user.id as string,
      email: session.user.email ?? '',
      name: session.user.name ?? '',
      role: userRole,
    }
    return handler(req, user, context)
  }
}
