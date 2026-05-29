export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { withRole } from '@/lib/middleware/withRole'
import { prisma } from '@/lib/db'

export const GET = withRole('admin', async (req) => {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const action = searchParams.get('action')
  const resource = searchParams.get('resource')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const cursor = searchParams.get('cursor')
  const limit = 50

  const logs = await prisma.auditLog.findMany({
    where: {
      ...(userId ? { userId } : {}),
      ...(action ? { action } : {}),
      ...(resource ? { resource } : {}),
      ...(from || to ? { createdAt: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } } : {}),
    },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } } },
  })

  const hasMore = logs.length > limit
  const data = hasMore ? logs.slice(0, -1) : logs
  return NextResponse.json({ data, nextCursor: hasMore ? data[data.length - 1]?.id : null, hasMore })
})
