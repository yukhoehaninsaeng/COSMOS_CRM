'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, User, ShoppingCart, Activity, MessageSquare, Megaphone } from 'lucide-react'
import Link from 'next/link'

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then(r => r.json())
      .then(d => { setCustomer(d as Record<string, unknown>); setLoading(false) })
  }, [id])

  if (loading) return <div className="p-8 text-muted-foreground">불러오는 중...</div>
  if (!customer) return <div className="p-8 text-muted-foreground">고객을 찾을 수 없습니다.</div>

  const rfm = customer.rfmScore as { r: number; f: number; m: number; total: number } | null
  const orders = (customer.orders as Record<string, unknown>[]) ?? []
  const events = (customer.events as Record<string, unknown>[]) ?? []
  const campaignSends = (customer.campaignSends as Record<string, unknown>[]) ?? []
  const vocReviews = (customer.vocReviews as Record<string, unknown>[]) ?? []
  const identities = (customer.identities as Record<string, unknown>[]) ?? []

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/customers" className="text-muted-foreground hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{customer.name as string ?? '이름 없음'}</h1>
          <p className="text-muted-foreground">{customer.email as string ?? '-'}</p>
        </div>
        {customer.segment && <Badge>{customer.segment as string}</Badge>}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground">LTV</div><div className="text-xl font-bold mt-1">₩{Number(customer.ltv ?? 0).toLocaleString()}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground">주문 수</div><div className="text-xl font-bold mt-1">{orders.length}건</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground">RFM 점수</div><div className="text-xl font-bold mt-1">{rfm ? `${rfm.total}점` : '-'}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground">피부 타입</div><div className="text-xl font-bold mt-1">{customer.skinType as string ?? '-'}</div></CardContent></Card>
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
              <div><div className="text-sm text-muted-foreground">이메일</div><div className="font-medium">{customer.email as string ?? '-'}</div></div>
              <div><div className="text-sm text-muted-foreground">전화</div><div className="font-medium">{customer.phone as string ?? '-'}</div></div>
              <div><div className="text-sm text-muted-foreground">성별</div><div className="font-medium">{customer.gender as string ?? '-'}</div></div>
              <div><div className="text-sm text-muted-foreground">출생연도</div><div className="font-medium">{customer.birthYear as string ?? '-'}</div></div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">연결 채널</div>
                <div className="flex gap-2 flex-wrap">
                  {identities.map((i, idx) => <Badge key={idx} variant="outline">{i.channel as string}</Badge>)}
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
                  <div key={order.id as string} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{order.channel as string} · {new Date(order.orderedAt as string).toLocaleDateString('ko-KR')}</div>
                      <div className="text-sm text-muted-foreground">{((order.orderItems as unknown[]) ?? []).length}개 상품</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₩{Number(order.totalAmount).toLocaleString()}</div>
                      <Badge variant="outline">{order.status as string}</Badge>
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
                  <div key={event.id as string} className="p-4 flex items-center gap-3">
                    <Activity className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{event.eventType as string}</div>
                      <div className="text-xs text-muted-foreground">{new Date(event.occurredAt as string).toLocaleString('ko-KR')}</div>
                    </div>
                    {event.channel && <Badge variant="outline" className="ml-auto">{event.channel as string}</Badge>}
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
                  <div key={review.id as string} className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={review.sentiment === 'positive' ? 'default' : review.sentiment === 'negative' ? 'destructive' : 'secondary'}>{review.sentiment as string}</Badge>
                      <span className="text-sm text-muted-foreground">{'★'.repeat(review.rating as number)}</span>
                    </div>
                    <p className="text-sm">{review.content as string}</p>
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
                {campaignSends.map(send => {
                  const campaign = send.campaign as Record<string, unknown>
                  return (
                    <div key={send.id as string} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{campaign?.name as string}</div>
                        <div className="text-xs text-muted-foreground">{send.sentAt ? new Date(send.sentAt as string).toLocaleDateString('ko-KR') : '-'}</div>
                      </div>
                      <div className="flex gap-2">
                        {send.openedAt && <Badge variant="outline">오픈</Badge>}
                        {send.clickedAt && <Badge variant="outline">클릭</Badge>}
                        {send.convertedAt && <Badge>전환</Badge>}
                      </div>
                    </div>
                  )
                })}
                {campaignSends.length === 0 && <div className="p-8 text-center text-muted-foreground">발송 이력이 없습니다.</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
