import type { ChannelAdapter, RawOrder, RawInventory, RawCustomer } from './ChannelAdapter'

export class NaverAdapter implements ChannelAdapter {
  channel = 'naver'
  async fetchOrders(_since: Date): Promise<RawOrder[]> { return [] }
  async fetchInventory(): Promise<RawInventory[]> { return [] }
  parseOrder(raw: Record<string, unknown>): RawOrder {
    return { channelOrderId: raw.orderId as string, items: [], totalAmount: raw.totalPayAmt as number ?? 0, discountAmount: 0, status: raw.productOrderStatus as string ?? 'pending', orderedAt: new Date(raw.paymentDate as string) }
  }
  parseCustomer(raw: Record<string, unknown>): RawCustomer {
    return { channelUserId: raw.ordererNo as string, email: raw.orderEmail as string, phone: raw.ordererTel as string, name: raw.ordererName as string }
  }
}
