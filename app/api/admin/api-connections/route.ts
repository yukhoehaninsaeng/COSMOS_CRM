export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { withRole } from '@/lib/middleware/withRole'
import { prisma } from '@/lib/db'
import { encrypt } from '@/lib/utils/crypto'

export const GET = withRole('admin', async () => {
  const connections = await prisma.apiConnection.findMany({ orderBy: { createdAt: 'desc' } })
  const sanitized = connections.map(c => ({ ...c, tokenEncrypted: undefined, refreshToken: undefined }))
  return NextResponse.json(sanitized)
})

export const POST = withRole('admin', async (req) => {
  const body = await req.json() as Record<string, unknown>
  if (body.token) {
    body.tokenEncrypted = encrypt(body.token as string)
    delete body.token
  }
  const connection = await prisma.apiConnection.create({ data: body as Parameters<typeof prisma.apiConnection.create>[0]['data'] })
  return NextResponse.json({ ...connection, tokenEncrypted: undefined }, { status: 201 })
})
