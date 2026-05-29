import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { prisma } from '@/lib/db'

export const GET = withAuth(async (_req, _user, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ error: 'ID 필요' }, { status: 400 })

  const [total, delivered, opened, clicked, converted] = await Promise.all([
    prisma.campaignSend.count({ where: { campaignId: id } }),
    prisma.campaignSend.count({ where: { campaignId: id, status: { in: ['delivered', 'opened', 'clicked', 'converted'] } } }),
    prisma.campaignSend.count({ where: { campaignId: id, openedAt: { not: null } } }),
    prisma.campaignSend.count({ where: { campaignId: id, clickedAt: { not: null } } }),
    prisma.campaignSend.count({ where: { campaignId: id, convertedAt: { not: null } } }),
  ])

  const revenue = await prisma.campaignSend.aggregate({
    where: { campaignId: id },
    _sum: { revenueAttr: true },
  })

  return NextResponse.json({
    total, delivered, opened, clicked, converted,
    openRate: total > 0 ? ((opened / total) * 100).toFixed(1) : '0',
    clickRate: total > 0 ? ((clicked / total) * 100).toFixed(1) : '0',
    conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) : '0',
    totalRevenue: revenue._sum.revenueAttr ?? 0,
  })
})
