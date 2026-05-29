import type { ChannelAdapter, RawOrder, RawInventory, RawCustomer } from './ChannelAdapter'

export class CoupangAdapter implements ChannelAdapter {
  channel = 'coupang'
  async fetchOrders(_since: Date): Promise<RawOrder[]> { return [] }
  async fetchInventory(): Promise<RawInventory[]> { return [] }
  parseOrder(raw: Record<string, unknown>): RawOrder {
    return {
      channelOrderId: raw.orderId as string,
      customerEmail: raw.buyerEmail as string,
      customerPhone: raw.receiverPhoneNumber as string,
      customerName: raw.receiverName as string,
      channelUserId: raw.buyerMemberId as string,
      items: [],
      totalAmount: raw.totalPrice as number ?? 0,
      discountAmount: 0,
      status: raw.status as string ?? 'pending',
      orderedAt: new Date(raw.orderDate as string),
    }
  }
  parseCustomer(raw: Record<string, unknown>): RawCustomer {
    return { channelUserId: raw.buyerMemberId as string, email: raw.buyerEmail as string, phone: raw.receiverPhoneNumber as string, name: raw.receiverName as string }
  }
}
