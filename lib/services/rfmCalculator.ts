import { prisma } from '@/lib/db'

function scoreR(days: number) { return days <= 30 ? 5 : days <= 60 ? 4 : days <= 90 ? 3 : days <= 180 ? 2 : 1 }
function scoreF(cnt: number) { return cnt >= 10 ? 5 : cnt >= 5 ? 4 : cnt >= 3 ? 3 : cnt >= 2 ? 2 : 1 }
function scoreM(amt: number) { return amt >= 1000000 ? 5 : amt >= 500000 ? 4 : amt >= 200000 ? 3 : amt >= 50000 ? 2 : 1 }

export async function calculateRfmForAllCustomers() {
  const customers = await prisma.customer.findMany({ where: { isActive: true }, select: { id: true } })
  const now = new Date()
  for (let i = 0; i < customers.length; i += 100) {
    const batch = customers.slice(i, i + 100)
    await Promise.all(batch.map(async ({ id }) => {
      const orders = await prisma.order.findMany({
        where: { customerId: id, status: { in: ['paid', 'shipped', 'delivered'] } },
        select: { totalAmount: true, orderedAt: true },
        orderBy: { orderedAt: 'desc' },
      })
      if (!orders.length) return
      const days = Math.floor((now.getTime() - orders[0].orderedAt.getTime()) / 86400000)
      const total = orders.reduce((s, o) => s + Number(o.totalAmount), 0)
      const r = scoreR(days), f = scoreF(orders.length), m = scoreM(total)
      const segment = r + f + m >= 13 ? 'vip' : days > 90 ? 'churn_risk' : 'normal'
      await prisma.customer.update({ where: { id }, data: { rfmScore: { r, f, m, total: r + f + m }, ltv: total, segment } })
    }))
  }
}
