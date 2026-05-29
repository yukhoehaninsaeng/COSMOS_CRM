import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { prisma } from '@/lib/db'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get('cursor')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100)
  const search = searchParams.get('search') ?? ''
  const segment = searchParams.get('segment') ?? ''

  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (segment) where.segment = segment

  const customers = await prisma.customer.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, email: true, phone: true, segment: true,
      ltv: true, rfmScore: true, skinType: true, isActive: true, createdAt: true,
      _count: { select: { orders: true } },
    },
  })

  const hasMore = customers.length > limit
  const data = hasMore ? customers.slice(0, -1) : customers
  const nextCursor = hasMore ? data[data.length - 1]?.id : null

  return NextResponse.json({ data, nextCursor, hasMore })
})

export const PATCH = withAuth(async (req) => {
  const body = await req.json() as Record<string, unknown>
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID 필요' }, { status: 400 })
  const customer = await prisma.customer.update({ where: { id }, data: body })
  return NextResponse.json(customer)
})
