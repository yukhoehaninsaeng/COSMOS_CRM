'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Activity } from 'lucide-react'
import Link from 'next/link'

type RfmScore = { r: number; f: number; m: number; total: number }
type Identity = { channel: string }
type OrderItem = { skuMaster?: { name: string } }
type Order = { id: string; channel: string; orderedAt: string; totalAmount: number; status: string; orderItems: OrderItem[] }
type Event = { id: string; eventType: string; occurredAt: string; channel?: string | null }
type VocReview = { id: string; sentiment?: string | null; rating?: number | null; content?: string | null }
type CampaignSend = { id: string; sentAt?: string | null; openedAt?: string | null; clickedAt?: string | null; convertedAt?: string | null; campaign?: { name: string; type: string } | null }

type CustomerDetail = {
  id: string
  name?: string | null
  email?: string | null
  phone?: string | null
  gender?: string | null
  birthYear?: number | null
  skinType?: string | null
  segment?: string | null
  ltv?: number | null
  rfmScore?: RfmScore | null
  identities: Identity[]
  orders: Order[]
  events: Event[]
  campaignSends: CampaignSend[]
  vocReviews: VocReview[]
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then(r => r.json())
      .then(d => { setCustomer(d as CustomerDetail); setLoading(false) })
  }, [id])

  if (loading) return <div className="p-8 text-muted-foreground">불러오는 중...</div>
  if (!customer) return <div className="p-8 text-muted-foreground">고객을 찾을 수 없습니다.</div>

  const rfm = customer.rfmScore
  const orders = customer.orders ?? []
  const events = customer.events ?? []
  const campaignSends = customer.campaignSends ?? []
  const vocReviews = customer.vocReviews ?? []
  const identities = customer.identities ?? []

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/customers" className="text-muted-foreground hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{customer.name ?? '이름 없음'}</h1>
          <p className="text-muted-foreground">{customer.email ?? '-'}</p>
        </div>
        {customer.segment ? <Badge>{customer.segment}</Badge> : null}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground">LTV</div><div className="text-xl font-bold mt-1">₩{Number(customer.ltv ?? 0).toLocaleString()}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground">주문 수</div><div className="text-xl font-bold mt-1">{orders.length}건</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground">RFM 점수</div><div className="text-xl font-bold mt-1">{rfm ? `${rfm.total}점` : '-'}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground">피부 타입</div><div className="text-xl font-bold mt-1">{customer.skinType ?? '-'}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">기본 정보</TabsTrigger>
          <TabsTrigger value="orders">구매 이력 ({orders.length})</TabsTrigger>
          <TabsTrigger value="events">행동 이벤트 ({events.length})</TabsTrigger>
          <TabsTrigger value="voc">VOC ({vocReviews.length})</TabsTrigger>
          <TabsTrigger value="campaigns">캠페인 ({campaignSends.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <Card>
            <CardContent className="p-6 grid grid-cols-2 gap-4">
              <div><div className="text-sm text-muted-foreground">이메일</div><div className="font-medium">{customer.email ?? '-'}</div></div>
              <div><div className="text-sm text-muted-foreground">전화</div><div className="font-medium">{customer.phone ?? '-'}</div></div>
              <div><div className="text-sm text-muted-foreground">성별</div><div className="font-medium">{customer.gender ?? '-'}</div></div>
              <div><div className="text-sm text-muted-foreground">출생연도</div><div className="font-medium">{customer.birthYear ?? '-'}</div></div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">연결 채널</div>
                <div className="flex gap-2 flex-wrap">
                  {identities.map((i, idx) => <Badge key={idx} variant="outline">{i.channel}</Badge>)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {orders.map(order => (
                  <div key={order.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{order.channel} · {new Date(order.orderedAt).toLocaleDateString('ko-KR')}</div>
                      <div className="text-sm text-muted-foreground">{order.orderItems.length}개 상품</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₩{Number(order.totalAmount).toLocaleString()}</div>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <div className="p-8 text-center text-muted-foreground">구매 이력이 없습니다.</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {events.map(event => (
                  <div key={event.id} className="p-4 flex items-center gap-3">
                    <Activity className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{event.eventType}</div>
                      <div className="text-xs text-muted-foreground">{new Date(event.occurredAt).toLocaleString('ko-KR')}</div>
                    </div>
                    {event.channel ? <Badge variant="outline" className="ml-auto">{event.channel}</Badge> : null}
                  </div>
                ))}
                {events.length === 0 && <div className="p-8 text-center text-muted-foreground">이벤트가 없습니다.</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voc" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {vocReviews.map(review => (
                  <div key={review.id} className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={review.sentiment === 'positive' ? 'default' : review.sentiment === 'negative' ? 'destructive' : 'secondary'}>{review.sentiment ?? '중립'}</Badge>
                      <span className="text-sm text-muted-foreground">{'★'.repeat(review.rating ?? 0)}</span>
                    </div>
                    <p className="text-sm">{review.content ?? ''}</p>
                  </div>
                ))}
                {vocReviews.length === 0 && <div className="p-8 text-center text-muted-foreground">리뷰가 없습니다.</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {campaignSends.map(send => (
                  <div key={send.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{send.campaign?.name ?? '-'}</div>
                      <div className="text-xs text-muted-foreground">{send.sentAt ? new Date(send.sentAt).toLocaleDateString('ko-KR') : '-'}</div>
                    </div>
                    <div className="flex gap-2">
                      {send.openedAt ? <Badge variant="outline">오픈</Badge> : null}
                      {send.clickedAt ? <Badge variant="outline">클릭</Badge> : null}
                      {send.convertedAt ? <Badge>전환</Badge> : null}
                    </div>
                  </div>
                ))}
                {campaignSends.length === 0 && <div className="p-8 text-center text-muted-foreground">발송 이력이 없습니다.</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
