'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'
import Link from 'next/link'

type Campaign = {
  id: string
  name: string
  type: string
  status: string
  sentAt: string | null
  createdAt: string
  _count: { sends: number }
}

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: '초안', variant: 'secondary' },
  scheduled: { label: '예약됨', variant: 'outline' },
  sending: { label: '발송중', variant: 'default' },
  done: { label: '완료', variant: 'default' },
  paused: { label: '일시정지', variant: 'destructive' },
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/campaigns').then(r => r.json()).then((d: { data: Campaign[] }) => { setCampaigns(d.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">캠페인 관리</h1>
          <p className="text-muted-foreground mt-1">마케팅 캠페인 생성 및 발송 관리</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />새 캠페인</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>캠페인명</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>발송수</TableHead>
                <TableHead>발송일</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell><Badge variant="outline">{c.type}</Badge></TableCell>
                  <TableCell><Badge variant={STATUS_MAP[c.status]?.variant ?? 'secondary'}>{STATUS_MAP[c.status]?.label ?? c.status}</Badge></TableCell>
                  <TableCell>{c._count.sends.toLocaleString()}명</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{c.sentAt ? new Date(c.sentAt).toLocaleDateString('ko-KR') : '-'}</TableCell>
                  <TableCell><Link href={`/dashboard/campaigns/${c.id}`}><Button variant="ghost" size="sm">상세</Button></Link></TableCell>
                </TableRow>
              ))}
              {!loading && campaigns.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">캠페인이 없습니다. 새 캠페인을 만들어보세요.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
