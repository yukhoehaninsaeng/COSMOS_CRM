export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const GET = async () => {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const skuStats = await prisma.vocReview.groupBy({
    by: ['skuMasterId'],
    where: { ingestedAt: { gte: since } },
    _count: true,
  })

  const alerts = []
  for (const stat of skuStats) {
    const negative = await prisma.vocReview.count({
      where: { skuMasterId: stat.skuMasterId, sentiment: 'negative', ingestedAt: { gte: since } },
    })
    const ratio = negative / stat._count
    if (ratio > 0.15 || negative >= 10) {
      await prisma.vocReview.updateMany({
        where: { skuMasterId: stat.skuMasterId, ingestedAt: { gte: since } },
        data: { isAlert: true },
      })
      alerts.push({ skuMasterId: stat.skuMasterId, negativeRatio: ratio, negativeCount: negative })
    }
  }

  return NextResponse.json({ message: 'VOC 이상 징후 점검 완료', alerts })
}
