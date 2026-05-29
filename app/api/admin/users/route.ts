export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { withRole } from '@/lib/middleware/withRole'
import { prisma } from '@/lib/db'

export const GET = withRole('admin', async (req) => {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const role = searchParams.get('role') ?? ''

  const users = await prisma.user.findMany({
    where: {
      ...(search ? { OR: [{ name: { contains: search } }, { email: { contains: search } }] } : {}),
      ...(role ? { role } : {}),
    },
    select: { id: true, email: true, name: true, role: true, isActive: true, lastLoginAt: true, createdAt: true, group: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(users)
})
