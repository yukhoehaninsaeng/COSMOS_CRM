import { prisma } from '@/lib/db'
import type { RawCustomer } from '@/lib/adapters/ChannelAdapter'

export type ResolvedIdentity = {
  customerId: string
  isNew: boolean
  confidenceScore: number
}

function normalizeEmail(e: string) { return e.toLowerCase().trim() }
function normalizePhone(p: string) {
  const d = p.replace(/\D/g, '')
  return d.startsWith('82') ? '0' + d.slice(2) : d
}

export async function resolveIdentity(rawCustomer: RawCustomer, channel: string): Promise<ResolvedIdentity> {
  if (rawCustomer.email) {
    const email = normalizeEmail(rawCustomer.email)
    const existing = await prisma.customer.findFirst({ where: { email } })
    if (existing) {
      await upsertIdentity(existing.id, channel, rawCustomer, 1.0)
      return { customerId: existing.id, isNew: false, confidenceScore: 1.0 }
    }
  }
  if (rawCustomer.phone) {
    const phone = normalizePhone(rawCustomer.phone)
    const existing = await prisma.customer.findFirst({ where: { phone } })
    if (existing) {
      await upsertIdentity(existing.id, channel, rawCustomer, 1.0)
      return { customerId: existing.id, isNew: false, confidenceScore: 1.0 }
    }
  }
  const newCustomer = await prisma.customer.create({
    data: {
      email: rawCustomer.email ? normalizeEmail(rawCustomer.email) : null,
      phone: rawCustomer.phone ? normalizePhone(rawCustomer.phone) : null,
      name: rawCustomer.name,
      segment: 'new',
      ltv: 0,
    },
  })
  await upsertIdentity(newCustomer.id, channel, rawCustomer, 1.0)
  return { customerId: newCustomer.id, isNew: true, confidenceScore: 1.0 }
}

async function upsertIdentity(customerId: string, channel: string, raw: RawCustomer, score: number) {
  await prisma.customerIdentity.upsert({
    where: { channel_channelUserId: { channel, channelUserId: raw.channelUserId } },
    update: { confidenceScore: score },
    create: {
      customerId,
      channel,
      channelUserId: raw.channelUserId,
      identifierType: raw.email ? 'email' : raw.phone ? 'phone' : 'device_id',
      identifierValue: raw.email ?? raw.phone ?? raw.channelUserId,
      confidenceScore: score,
    },
  })
}
