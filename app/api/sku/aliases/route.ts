import { NextResponse } from 'next/server'
import { withRole } from '@/lib/middleware/withRole'
import { prisma } from '@/lib/db'

export const POST = withRole('manager', async (req) => {
  const body = await req.json() as { skuMasterId: string; channel: string; aliasCode: string; aliasName?: string }
  const alias = await prisma.skuAlias.create({ data: { ...body, isVerified: true } })
  return NextResponse.json(alias, { status: 201 })
})
