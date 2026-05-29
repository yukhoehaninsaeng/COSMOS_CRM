import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { withRole } from '@/lib/middleware/withRole'
import { prisma } from '@/lib/db'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get('cursor')
  const limit = 20
  const campaigns = await prisma.campaign.findMany({
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { sends: true } } },
  })
  const hasMore = campaigns.length > limit
  const data = hasMore ? campaigns.slice(0, -1) : campaigns
  return NextResponse.json({ data, nextCursor: hasMore ? data[data.length - 1]?.id : null, hasMore })
})

export const POST = withRole('manager', async (req, user) => {
  const body = await req.json() as Record<string, unknown>
  const campaign = await prisma.campaign.create({
    data: { ...body, createdBy: user.id } as Parameters<typeof prisma.campaign.create>[0]['data'],
  })
  return NextResponse.json(campaign, { status: 201 })
})
