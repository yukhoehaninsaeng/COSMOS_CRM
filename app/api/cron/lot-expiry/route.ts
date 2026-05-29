export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/utils/email'

export const GET = async () => {
  const thresholds = [7, 30, 60]
  const alerts: string[] = []

  for (const days of thresholds) {
    const deadline = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    const skus = await prisma.skuMaster.findMany({
      where: { lotExpiry: { gte: new Date(), lte: deadline }, isActive: true },
      select: { name: true, skuCode: true, lotExpiry: true },
    })
    if (skus.length > 0) {
      alerts.push(`D-${days} 임박 SKU ${skus.length}건: ${skus.map(s => s.name).join(', ')}`)
    }
  }

  if (alerts.length > 0) {
    const adminUsers = await prisma.user.findMany({
      where: { role: { in: ['super_admin', 'admin'] }, isActive: true },
      select: { email: true },
    })
    for (const admin of adminUsers) {
      await sendEmail(admin.email, '[BeautyFlow] 유통기한 임박 알림', `<ul>${alerts.map(a => `<li>${a}</li>`).join('')}</ul>`)
    }
  }

  return NextResponse.json({ message: '유통기한 점검 완료', alerts })
}
