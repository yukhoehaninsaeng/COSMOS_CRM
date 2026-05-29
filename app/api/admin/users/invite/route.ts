import { NextResponse } from 'next/server'
import { withRole } from '@/lib/middleware/withRole'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/utils/email'
import crypto from 'crypto'

export const POST = withRole('admin', async (req, user) => {
  const { email, role, groupId } = await req.json() as { email: string; role: string; groupId?: string }
  if (!email) return NextResponse.json({ error: '이메일 필요' }, { status: 400 })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: '이미 등록된 이메일' }, { status: 409 })

  const token = crypto.randomBytes(32).toString('hex')
  const newUser = await prisma.user.create({
    data: {
      email,
      role: role ?? 'member',
      groupId: groupId ?? null,
      invitedBy: user.id,
      isActive: false,
      passwordHash: `invite:${token}:${Date.now() + 48 * 60 * 60 * 1000}`,
    },
  })

  const inviteUrl = `${process.env.NEXTAUTH_URL}/accept-invite?token=${token}&userId=${newUser.id}`
  await sendEmail(email, '[BeautyFlow CRM] 초대장', `
    <h2>BeautyFlow CRM에 초대되었습니다.</h2>
    <p>아래 링크를 클릭하여 계정을 설정하세요 (48시간 유효):</p>
    <a href="${inviteUrl}">${inviteUrl}</a>
  `)

  return NextResponse.json({ message: '초대 이메일 발송 완료', userId: newUser.id }, { status: 201 })
})
