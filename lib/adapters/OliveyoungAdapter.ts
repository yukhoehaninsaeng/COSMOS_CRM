import type { ChannelAdapter, RawOrder, RawInventory, RawCustomer } from './ChannelAdapter'

export class OliveyoungAdapter implements ChannelAdapter {
  channel = 'oliveyoung'
  async fetchOrders(_since: Date): Promise<RawOrder[]> { return [] }
  async fetchInventory(): Promise<RawInventory[]> { return [] }
  parseOrder(raw: Record<string, unknown>): RawOrder {
    return { channelOrderId: raw.orderNo as string, items: [], totalAmount: raw.totalAmt as number ?? 0, discountAmount: 0, status: raw.orderStatus as string ?? 'pending', orderedAt: new Date(raw.orderDate as string) }
  }
  parseCustomer(raw: Record<string, unknown>): RawCustomer {
    return { channelUserId: raw.memberId as string, email: raw.email as string, phone: raw.phone as string, name: raw.name as string }
  }
}
