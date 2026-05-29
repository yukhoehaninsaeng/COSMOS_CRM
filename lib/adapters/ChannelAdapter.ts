export type RawOrder = {
  channelOrderId: string
  customerEmail?: string
  customerPhone?: string
  customerName?: string
  channelUserId?: string
  items: Array<{ aliasCode: string; qty: number; unitPrice: number; lotNumber?: string }>
  totalAmount: number
  discountAmount: number
  status: string
  orderedAt: Date
}

export type RawInventory = {
  aliasCode: string
  qtyAvailable: number
  qtyReserved: number
}

export type RawCustomer = {
  channelUserId: string
  email?: string
  phone?: string
  name?: string
}

export interface ChannelAdapter {
  channel: string
  fetchOrders(since: Date): Promise<RawOrder[]>
  fetchInventory(): Promise<RawInventory[]>
  parseOrder(raw: Record<string, unknown>): RawOrder
  parseCustomer(raw: Record<string, unknown>): RawCustomer
}
