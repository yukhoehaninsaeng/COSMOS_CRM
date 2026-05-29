export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { prisma } from '@/lib/db'

export const GET = withAuth(async () => {
  const campaigns = await prisma.campaign.findMany({
    where: { status: 'done' },
    include: {
      _count: { select: { sends: true } },
      sends: { where: { openedAt: { not: null } }, select: { id: true } },
    },
    orderBy: { sentAt: 'desc' },
    take: 10,
  })

  const influencerCampaigns = await prisma.influencerCampaign.findMany({
    include: { influencer: { select: { name: true, channel: true } } },
    orderBy: { roi: 'desc' },
    take: 10,
  })

  return NextResponse.json({ campaigns, influencerCampaigns })
})
