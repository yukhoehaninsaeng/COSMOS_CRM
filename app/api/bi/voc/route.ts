export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { prisma } from '@/lib/db'

export const GET = withAuth(async () => {
  const sentimentBreakdown = await prisma.vocReview.groupBy({
    by: ['sentiment'],
    _count: true,
  })

  const alertCount = await prisma.vocReview.count({ where: { isAlert: true } })

  const recentReviews = await prisma.vocReview.findMany({
    orderBy: { ingestedAt: 'desc' },
    take: 20,
    include: { skuMaster: { select: { name: true } } },
  })

  return NextResponse.json({ sentimentBreakdown, alertCount, recentReviews })
})
