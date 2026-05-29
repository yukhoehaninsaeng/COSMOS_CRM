import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { prisma } from '@/lib/db'

export const GET = withAuth(async () => {
  const [totalCustomers, segmentBreakdown, repeatCustomers] = await Promise.all([
    prisma.customer.count({ where: { isActive: true } }),
    prisma.customer.groupBy({ by: ['segment'], _count: true, _sum: { ltv: true } }),
    prisma.customer.count({
      where: { isActive: true, orders: { some: { status: { in: ['paid', 'shipped', 'delivered'] } } } },
    }),
  ])

  const ltvStats = await prisma.customer.aggregate({ _avg: { ltv: true }, _sum: { ltv: true } })
  const churnRisk = await prisma.customer.count({ where: { segment: 'churn_risk', isActive: true } })

  return NextResponse.json({
    totalCustomers,
    avgLtv: Number(ltvStats._avg.ltv ?? 0),
    totalLtv: Number(ltvStats._sum.ltv ?? 0),
    repeatRate: totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(1) : '0',
    churnRiskCount: churnRisk,
    segmentBreakdown,
  })
})
