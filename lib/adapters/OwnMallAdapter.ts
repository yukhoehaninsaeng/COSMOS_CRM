import type { ChannelAdapter, RawOrder, RawInventory, RawCustomer } from './ChannelAdapter'

export class OwnMallAdapter implements ChannelAdapter {
  channel = 'own_mall'
  async fetchOrders(_since: Date): Promise<RawOrder[]> { return [] }
  async fetchInventory(): Promise<RawInventory[]> { return [] }
  parseOrder(raw: Record<string, unknown>): RawOrder {
    return {
      channelOrderId: raw.id as string,
      customerEmail: raw.customer_email as string,
      customerPhone: raw.customer_phone as string,
      customerName: raw.customer_name as string,
      channelUserId: raw.user_id as string,
      items: [],
      totalAmount: raw.total_amount as number ?? 0,
      discountAmount: raw.discount_amount as number ?? 0,
      status: raw.status as string ?? 'pending',
      orderedAt: new Date(raw.ordered_at as string),
    }
  }
  parseCustomer(raw: Record<string, unknown>): RawCustomer {
    return { channelUserId: raw.user_id as string, email: raw.email as string, phone: raw.phone as string, name: raw.name as string }
  }
}
