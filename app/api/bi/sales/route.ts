export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { prisma } from '@/lib/db'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const channel = searchParams.get('channel')
  const from = searchParams.get('from') ? new Date(searchParams.get('from')!) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const to = searchParams.get('to') ? new Date(searchParams.get('to')!) : new Date()

  const where = {
    orderedAt: { gte: from, lte: to },
    status: { in: ['paid', 'shipped', 'delivered'] },
    ...(channel && channel !== 'all' ? { channel } : {}),
  }

  const [totalRevenue, totalOrders, newCustomers, returnCount] = await Promise.all([
    prisma.order.aggregate({ where, _sum: { totalAmount: true } }),
    prisma.order.count({ where }),
    prisma.customer.count({ where: { createdAt: { gte: from, lte: to } } }),
    prisma.order.count({ where: { ...where, status: 'returned' } }),
  ])

  const avgOrderValue = totalOrders > 0 ? Number(totalRevenue._sum.totalAmount ?? 0) / totalOrders : 0

  const channelBreakdown = await prisma.order.groupBy({
    by: ['channel'],
    where: { orderedAt: { gte: from, lte: to }, status: { in: ['paid', 'shipped', 'delivered'] } },
    _sum: { totalAmount: true },
    _count: true,
  })

  return NextResponse.json({
    totalRevenue: Number(totalRevenue._sum.totalAmount ?? 0),
    totalOrders,
    avgOrderValue,
    newCustomers,
    returnRate: totalOrders > 0 ? ((returnCount / totalOrders) * 100).toFixed(1) : '0',
    channelBreakdown,
  })
})
