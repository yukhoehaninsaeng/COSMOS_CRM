import { NextResponse } from 'next/server'
import { withRole } from '@/lib/middleware/withRole'
import { prisma } from '@/lib/db'

export const POST = withRole('admin', async (req) => {
  const { sourceId, targetId } = await req.json() as { sourceId: string; targetId: string }
  if (!sourceId || !targetId) return NextResponse.json({ error: '두 고객 ID 필요' }, { status: 400 })

  await prisma.$transaction([
    prisma.customerIdentity.updateMany({ where: { customerId: sourceId }, data: { customerId: targetId } }),
    prisma.customerEvent.updateMany({ where: { customerId: sourceId }, data: { customerId: targetId } }),
    prisma.order.updateMany({ where: { customerId: sourceId }, data: { customerId: targetId } }),
    prisma.campaignSend.updateMany({ where: { customerId: sourceId }, data: { customerId: targetId } }),
    prisma.customer.update({ where: { id: targetId }, data: { ltv: { increment: 0 } } }),
    prisma.customer.delete({ where: { id: sourceId } }),
  ])

  return NextResponse.json({ message: '병합 완료', targetId })
})
