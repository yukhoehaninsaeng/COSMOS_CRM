import { NextRequest, NextResponse } from 'next/server'
import { withRole } from '@/lib/middleware/withRole'
import { prisma } from '@/lib/db'

export const GET = withRole('admin', async (req) => {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const logs = await prisma.auditLog.findMany({
    where: {
      createdAt: {
        gte: from ? new Date(from) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        ...(to ? { lte: new Date(to) } : {}),
      },
    },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } } },
    take: 10000,
  })

  const header = 'ID,사용자,이메일,액션,리소스,리소스ID,IP,생성일\n'
  const rows = logs.map(l =>
    [l.id, l.user?.name ?? '', l.user?.email ?? '', l.action, l.resource, l.resourceId ?? '', l.ip ?? '', l.createdAt.toISOString()].join(',')
  ).join('\n')

  return new NextResponse(header + rows, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
})
