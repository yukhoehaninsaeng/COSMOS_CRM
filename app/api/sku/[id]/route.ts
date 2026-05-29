import { NextRequest, NextResponse } from 'next/server'
import { withRole } from '@/lib/middleware/withRole'
import { prisma } from '@/lib/db'

export const PATCH = withRole('manager', async (req, _user, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ error: 'ID 필요' }, { status: 400 })
  const body = await req.json() as Record<string, unknown>
  const sku = await prisma.skuMaster.update({ where: { id }, data: body as Parameters<typeof prisma.skuMaster.update>[0]['data'] })
  return NextResponse.json(sku)
})
