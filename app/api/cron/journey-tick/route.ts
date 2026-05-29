export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { tickJourneys } from '@/lib/services/journeyEngine'

export const GET = async () => {
  await tickJourneys()
  return NextResponse.json({ message: 'Journey 실행 완료', timestamp: new Date().toISOString() })
}
