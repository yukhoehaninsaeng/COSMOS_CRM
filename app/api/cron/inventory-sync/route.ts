export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { OwnMallAdapter } from '@/lib/adapters/OwnMallAdapter'
import { CoupangAdapter } from '@/lib/adapters/CoupangAdapter'
import { prisma } from '@/lib/db'

export const GET = async () => {
  const adapters = [new OwnMallAdapter(), new CoupangAdapter()]
  let synced = 0

  for (const adapter of adapters) {
    const inventory = await adapter.fetchInventory()
    for (const item of inventory) {
      const alias = await prisma.skuAlias.findUnique({
        where: { channel_aliasCode: { channel: adapter.channel, aliasCode: item.aliasCode } },
      })
      if (!alias) continue
      await prisma.inventory.upsert({
        where: { skuMasterId_channel: { skuMasterId: alias.skuMasterId, channel: adapter.channel } },
        update: { qtyAvailable: item.qtyAvailable, qtyReserved: item.qtyReserved },
        create: { skuMasterId: alias.skuMasterId, channel: adapter.channel, qtyAvailable: item.qtyAvailable, qtyReserved: item.qtyReserved },
      })
      synced++
    }
  }

  return NextResponse.json({ message: '재고 동기화 완료', synced })
}
