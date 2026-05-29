import { prisma } from '@/lib/db'

export async function decomposeBundleItem(bundleSkuId: string, bundleQty: number, bundleUnitPrice: number, parentItemId: string) {
  const components = await prisma.skuBundle.findMany({ where: { bundleSkuId } })
  const result = []
  for (const c of components) {
    result.push({
      componentSkuId: c.componentSkuId,
      qty: c.qty * bundleQty,
      unitPrice: bundleUnitPrice * Number(c.costRatio),
      isGift: c.isGift,
      parentItemId,
    })
    await prisma.inventory.updateMany({
      where: { skuMasterId: c.componentSkuId },
      data: { qtyAvailable: { decrement: c.qty * bundleQty } },
    })
  }
  return result
}
