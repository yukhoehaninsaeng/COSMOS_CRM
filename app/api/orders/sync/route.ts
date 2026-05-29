import { NextResponse } from 'next/server'
import { withRole } from '@/lib/middleware/withRole'
import { OwnMallAdapter } from '@/lib/adapters/OwnMallAdapter'
import { CoupangAdapter } from '@/lib/adapters/CoupangAdapter'

export const POST = withRole('manager', async (req) => {
  const { channel } = await req.json() as { channel: string }
  const adapters: Record<string, { fetchOrders: (d: Date) => Promise<unknown[]> }> = {
    own_mall: new OwnMallAdapter(),
    coupang: new CoupangAdapter(),
  }
  const adapter = adapters[channel]
  if (!adapter) return NextResponse.json({ error: '지원하지 않는 채널' }, { status: 400 })
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const orders = await adapter.fetchOrders(since)
  return NextResponse.json({ message: `${orders.length}건 동기화 완료`, channel })
})
