import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { withRole } from '@/lib/middleware/withRole'
import { prisma } from '@/lib/db'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const cursor = searchParams.get('cursor')
  const limit = 20

  const skus = await prisma.skuMaster.findMany({
    where: { ...(category ? { category } : {}), isActive: true },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { inventory: true, aliases: true } } },
  })

  const hasMore = skus.length > limit
  const data = hasMore ? skus.slice(0, -1) : skus
  return NextResponse.json({ data, nextCursor: hasMore ? data[data.length - 1]?.id : null, hasMore })
})

export const POST = withRole('manager', async (req) => {
  const body = await req.json() as Record<string, unknown>
  const sku = await prisma.skuMaster.create({ data: body as Parameters<typeof prisma.skuMaster.create>[0]['data'] })
  return NextResponse.json(sku, { status: 201 })
})
