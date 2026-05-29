import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/withAuth'
import { prisma } from '@/lib/db'

export const GET = withAuth(async () => {
  const lowStock = await prisma.inventory.findMany({
    where: { qtyAvailable: { lte: prisma.inventory.fields.reorderPoint } },
    include: { skuMaster: { select: { name: true, skuCode: true } } },
  })

  const expiringSkus = await prisma.skuMaster.findMany({
    where: {
      lotExpiry: {
        gte: new Date(),
        lte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    },
    include: { inventory: true },
  })

  return NextResponse.json({ lowStock, expiringSkus })
})
