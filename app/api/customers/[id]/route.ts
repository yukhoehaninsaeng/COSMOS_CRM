import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { prisma } from '@/lib/db'

export const GET = withAuth(async (_req, _user, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ error: 'ID 필요' }, { status: 400 })

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      identities: true,
      orders: {
        orderBy: { orderedAt: 'desc' },
        take: 20,
        include: { orderItems: { include: { skuMaster: { select: { name: true, skuCode: true } } } } },
      },
      events: { orderBy: { occurredAt: 'desc' }, take: 50 },
      campaignSends: {
        orderBy: { sentAt: 'desc' },
        take: 20,
        include: { campaign: { select: { name: true, type: true } } },
      },
    },
  })

  if (!customer) return NextResponse.json({ error: '고객을 찾을 수 없습니다.' }, { status: 404 })

  const vocReviews = await prisma.vocReview.findMany({
    where: {
      skuMasterId: {
        in: customer.orders.flatMap(o => o.orderItems.map(i => i.skuMasterId)),
      },
    },
    orderBy: { ingestedAt: 'desc' },
    take: 10,
    include: { skuMaster: { select: { name: true } } },
  })

  return NextResponse.json({ ...customer, vocReviews })
})

export const PATCH = withAuth(async (req, _user, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ error: 'ID 필요' }, { status: 400 })
  const body = await req.json() as Record<string, unknown>
  const customer = await prisma.customer.update({ where: { id }, data: body })
  return NextResponse.json(customer)
})
