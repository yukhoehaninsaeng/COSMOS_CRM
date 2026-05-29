import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { prisma } from '@/lib/db'

export const GET = withAuth(async (_req, _user, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ error: 'ID 필요' }, { status: 400 })
  const events = await prisma.customerEvent.findMany({
    where: { customerId: id },
    orderBy: { occurredAt: 'desc' },
    take: 50,
    include: { sku: { select: { name: true } } },
  })
  return NextResponse.json(events)
})
