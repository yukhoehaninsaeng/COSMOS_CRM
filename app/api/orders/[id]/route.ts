import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { prisma } from '@/lib/db'

export const GET = withAuth(async (_req, _user, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ error: 'ID 필요' }, { status: 400 })
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      orderItems: { include: { skuMaster: true } },
    },
  })
  if (!order) return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
  return NextResponse.json(order)
})
