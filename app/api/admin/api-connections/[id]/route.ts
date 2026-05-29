import { NextResponse } from 'next/server'
import { withRole } from '@/lib/middleware/withRole'
import { prisma } from '@/lib/db'
import { encrypt } from '@/lib/utils/crypto'

export const PATCH = withRole('admin', async (req, _user, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ error: 'ID 필요' }, { status: 400 })
  const body = await req.json() as Record<string, unknown>
  if (body.token) {
    body.tokenEncrypted = encrypt(body.token as string)
    delete body.token
  }
  const conn = await prisma.apiConnection.update({ where: { id }, data: body as Parameters<typeof prisma.apiConnection.update>[0]['data'] })
  return NextResponse.json({ ...conn, tokenEncrypted: undefined })
})

export const DELETE = withRole('admin', async (_req, _user, context) => {
  const id = context?.params?.id
  if (!id) return NextResponse.json({ error: 'ID 필요' }, { status: 400 })
  await prisma.apiConnection.delete({ where: { id } })
  return NextResponse.json({ message: 'API 연결 삭제 완료' })
})
