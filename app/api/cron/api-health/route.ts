import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const GET = async () => {
  const connections = await prisma.apiConnection.findMany({ where: { status: { not: 'disconnected' } } })
  const results = []

  for (const conn of connections) {
    const start = Date.now()
    try {
      await fetch(conn.endpoint, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
      const latency = Date.now() - start
      const status = latency > 500 ? 'delayed' : 'connected'
      await prisma.apiConnection.update({ where: { id: conn.id }, data: { status, lastLatencyMs: latency, lastCheckedAt: new Date(), errorMessage: null } })
      results.push({ id: conn.id, name: conn.name, status, latency })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '연결 실패'
      await prisma.apiConnection.update({ where: { id: conn.id }, data: { status: 'error', lastCheckedAt: new Date(), errorMessage } })
      results.push({ id: conn.id, name: conn.name, status: 'error', errorMessage })
    }
  }

  return NextResponse.json({ message: '헬스체크 완료', results })
}
