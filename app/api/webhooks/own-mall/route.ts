import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const POST = async (req: NextRequest) => {
  const body = await req.json() as Record<string, unknown>
  await prisma.channelOrderRaw.create({
    data: { channel: 'own_mall', rawJson: body as object, processed: false },
  })
  return NextResponse.json({ received: true })
}
