import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('1q2w3e4r@@', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'fdadmin@flowit.com' },
    update: {},
    create: {
      email: 'fdadmin@flowit.com',
      name: 'fdadmin',
      passwordHash,
      role: 'super_admin',
      isActive: true,
    },
  })

  console.log('✅ 관리자 계정 생성:', admin.email)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
