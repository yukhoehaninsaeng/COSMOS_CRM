import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const GET = async () => {
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  const deleted = await prisma.channelOrderRaw.deleteMany({
    where: { ingestedAt: { lt: cutoff }, processed: true },
  })
  return NextResponse.json({ message: '정리 완료', deleted: deleted.count })
}
