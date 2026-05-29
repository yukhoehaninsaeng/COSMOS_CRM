import { NextResponse } from 'next/server'
import { withRole } from '@/lib/middleware/withRole'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export const PATCH = withRole('admin', async (req, _user, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ error: 'ID 필요' }, { status: 400 })
  const body = await req.json() as Record<string, unknown>
  delete body.passwordHash
  const updated = await prisma.user.update({ where: { id }, data: body as Parameters<typeof prisma.user.update>[0]['data'] })
  return NextResponse.json(updated)
})

export const DELETE = withRole('super_admin', async (_req, _user, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ error: 'ID 필요' }, { status: 400 })
  await prisma.auditLog.updateMany({ where: { userId: id }, data: { userId: null } })
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ message: '계정 삭제 완료' })
})
