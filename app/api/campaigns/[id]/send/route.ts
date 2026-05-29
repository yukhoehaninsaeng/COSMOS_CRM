import { NextResponse } from 'next/server'
import { withRole } from '@/lib/middleware/withRole'
import { prisma } from '@/lib/db'

export const POST = withRole('manager', async (_req, _user, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ error: 'ID 필요' }, { status: 400 })

  const campaign = await prisma.campaign.findUnique({ where: { id } })
  if (!campaign) return NextResponse.json({ error: '캠페인을 찾을 수 없습니다.' }, { status: 404 })
  if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
    return NextResponse.json({ error: '발송 가능한 상태가 아닙니다.' }, { status: 400 })
  }

  const filter = (campaign.segmentFilter as { segment?: string }) ?? {}
  const customers = await prisma.customer.findMany({
    where: { isActive: true, ...(filter.segment ? { segment: filter.segment } : {}) },
    select: { id: true },
    take: 1000,
  })

  await prisma.campaign.update({ where: { id }, data: { status: 'sending', sentAt: new Date() } })

  await prisma.campaignSend.createMany({
    data: customers.map(c => ({
      campaignId: id,
      customerId: c.id,
      status: 'sent',
      sentAt: new Date(),
    })),
    skipDuplicates: true,
  })

  await prisma.campaign.update({ where: { id }, data: { status: 'done' } })

  return NextResponse.json({ message: `${customers.length}명에게 발송 완료` })
})
