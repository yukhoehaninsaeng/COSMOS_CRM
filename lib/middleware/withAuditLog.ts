import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import type { AuthenticatedUser, AuthHandler } from './withAuth'
import { auth } from '@/lib/auth'

const SENSITIVE_FIELDS = ['password', 'passwordHash', 'token', 'tokenEncrypted', 'refreshToken']

function maskSensitive(obj: Record<string, unknown>): Record<string, unknown> {
  const masked = { ...obj }
  for (const f of SENSITIVE_FIELDS) {
    if (f in masked) masked[f] = '[MASKED]'
  }
  return masked
}

export function withAuditLog(
  options: { action: string; resource: string },
  handler: AuthHandler
) {
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
    let body: Record<string, unknown> = {}
    try {
      const cloned = req.clone()
      body = await cloned.json() as Record<string, unknown>
    } catch { /* no body */ }

    const response = await handler(req, user, context)
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const userAgent = req.headers.get('user-agent') ?? ''

    prisma.auditLog.create({
      data: {
        userId: user.id,
        action: options.action,
        resource: options.resource,
        ip,
        userAgent,
        payloadAfter: maskSensitive(body) as object,
      },
    }).catch(() => {})

    return response
  }
}
