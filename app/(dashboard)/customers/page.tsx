'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, ChevronRight } from 'lucide-react'
import Link from 'next/link'

type Customer = {
  id: string
  name: string | null
  email: string | null
  segment: string | null
  ltv: number | null
  rfmScore: { r: number; f: number; m: number; total: number } | null
  createdAt: string
  _count: { orders: number }
}

const SEGMENT_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  vip: { label: 'VIP', variant: 'default' },
  churn_risk: { label: '이탈위험', variant: 'destructive' },
  normal: { label: '일반', variant: 'secondary' },
  new: { label: '신규', variant: 'outline' },
  skincare: { label: '스킨케어', variant: 'secondary' },
  makeup: { label: '메이크업', variant: 'secondary' },
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [segment, setSegment] = useState('')
  const [loading, setLoading] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)

  const fetchCustomers = async (reset = true) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (segment) params.set('segment', segment)
    if (!reset && nextCursor) params.set('cursor', nextCursor)
    const res = await fetch(`/api/customers?${params}`)
    const data = await res.json() as { data: Customer[]; nextCursor: string | null }
    setCustomers(reset ? data.data : prev => [...prev, ...data.data])
    setNextCursor(data.nextCursor)
    setLoading(false)
  }

  useEffect(() => { fetchCustomers() }, [search, segment])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">고객 관리</h1>
          <p className="text-muted-foreground mt-1">통합 고객 데이터베이스</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="이름 또는 이메일 검색" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={segment}
              onChange={e => setSegment(e.target.value)}
            >
              <option value="">전체 세그먼트</option>
              <option value="vip">VIP</option>
              <option value="churn_risk">이탈위험</option>
              <option value="normal">일반</option>
              <option value="new">신규</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>고객명</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>세그먼트</TableHead>
                <TableHead>LTV</TableHead>
                <TableHead>RFM</TableHead>
                <TableHead>주문수</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name ?? '-'}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{c.email ?? '-'}</TableCell>
                  <TableCell>
                    {c.segment ? (
                      <Badge variant={(SEGMENT_LABELS[c.segment]?.variant) ?? 'secondary'}>
                        {SEGMENT_LABELS[c.segment]?.label ?? c.segment}
                      </Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell>₩{Number(c.ltv ?? 0).toLocaleString()}</TableCell>
                  <TableCell>
                    {c.rfmScore ? (
                      <span className="text-sm font-mono">R{c.rfmScore.r}F{c.rfmScore.f}M{c.rfmScore.m}</span>
                    ) : '-'}
                  </TableCell>
                  <TableCell>{c._count.orders}건</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(c.createdAt).toLocaleDateString('ko-KR')}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/customers/${c.id}`}>
                      <Button variant="ghost" size="icon"><ChevronRight className="w-4 h-4" /></Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {loading && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">불러오는 중...</TableCell></TableRow>
              )}
              {!loading && customers.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">고객 데이터가 없습니다.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          {nextCursor && (
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={() => fetchCustomers(false)} disabled={loading}>더 보기</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
