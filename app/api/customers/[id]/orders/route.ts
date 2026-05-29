import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { prisma } from '@/lib/db'

export const GET = withAuth(async (_req, _user, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ error: 'ID 필요' }, { status: 400 })
  const orders = await prisma.order.findMany({
    where: { customerId: id },
    orderBy: { orderedAt: 'desc' },
    include: { orderItems: { include: { skuMaster: { select: { name: true, skuCode: true } } } } },
  })
  return NextResponse.json(orders)
})
