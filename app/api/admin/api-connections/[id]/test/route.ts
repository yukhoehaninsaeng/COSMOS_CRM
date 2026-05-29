import { NextResponse } from 'next/server'
import { withRole } from '@/lib/middleware/withRole'
import { prisma } from '@/lib/db'

export const POST = withRole('admin', async (_req, _user, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ error: 'ID 필요' }, { status: 400 })
  const conn = await prisma.apiConnection.findUnique({ where: { id } })
  if (!conn) return NextResponse.json({ error: '연결을 찾을 수 없습니다.' }, { status: 404 })

  const start = Date.now()
  try {
    const res = await fetch(conn.endpoint, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
    const latency = Date.now() - start
    const status = res.ok ? 'connected' : latency > 500 ? 'delayed' : 'error'
    await prisma.apiConnection.update({ where: { id }, data: { status, lastLatencyMs: latency, lastCheckedAt: new Date(), errorMessage: null } })
    return NextResponse.json({ status, latencyMs: latency })
  } catch (err) {
    const latency = Date.now() - start
    const errorMessage = err instanceof Error ? err.message : '연결 실패'
    await prisma.apiConnection.update({ where: { id }, data: { status: 'error', lastLatencyMs: latency, lastCheckedAt: new Date(), errorMessage } })
    return NextResponse.json({ status: 'error', errorMessage })
  }
})
