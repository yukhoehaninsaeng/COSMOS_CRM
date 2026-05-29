import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { prisma } from '@/lib/db'

export const GET = withAuth(async () => {
  const raw = await prisma.channelOrderRaw.findMany({
    where: { processed: false, errorMessage: { not: null } },
    orderBy: { ingestedAt: 'desc' },
    take: 50,
  })
  return NextResponse.json(raw)
})
