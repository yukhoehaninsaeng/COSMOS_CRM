export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { prisma } from '@/lib/db'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const channel = searchParams.get('channel')
  const status = searchParams.get('status')
  const cursor = searchParams.get('cursor')
  const limit = 20

  const orders = await prisma.order.findMany({
    where: {
      ...(channel ? { channel } : {}),
      ...(status ? { status } : {}),
    },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { orderedAt: 'desc' },
    include: {
      customer: { select: { name: true, email: true } },
      _count: { select: { orderItems: true } },
    },
  })

  const hasMore = orders.length > limit
  const data = hasMore ? orders.slice(0, -1) : orders
  return NextResponse.json({ data, nextCursor: hasMore ? data[data.length - 1]?.id : null, hasMore })
})
