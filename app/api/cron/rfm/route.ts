import { NextResponse } from 'next/server'
import { calculateRfmForAllCustomers } from '@/lib/services/rfmCalculator'

export const GET = async () => {
  await calculateRfmForAllCustomers()
  return NextResponse.json({ message: 'RFM 계산 완료', timestamp: new Date().toISOString() })
}
