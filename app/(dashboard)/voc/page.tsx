'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type VocReview = {
  id: string
  channel: string
  rating: number | null
  content: string | null
  sentiment: string | null
  tags: string[] | null
  isAlert: boolean
  ingestedAt: string
  skuMaster: { name: string } | null
}

export default function VocPage() {
  const [data, setData] = useState<{ recentReviews: VocReview[]; alertCount: number } | null>(null)

  useEffect(() => {
    fetch('/api/bi/voc').then(r => r.json()).then(d => setData(d as typeof data)).catch(() => {})
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">VOC · 리뷰 분석</h1>
          <p className="text-muted-foreground mt-1">고객 리뷰 감성 분석 및 이상 징후 탐지</p>
        </div>
        {(data?.alertCount ?? 0) > 0 && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
            이상 징후 {data?.alertCount}건 감지
          </div>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>최근 리뷰</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>상품</TableHead>
                <TableHead>채널</TableHead>
                <TableHead>평점</TableHead>
                <TableHead>감성</TableHead>
                <TableHead>키워드</TableHead>
                <TableHead>내용</TableHead>
                <TableHead>수집일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.recentReviews ?? []).map(review => (
                <TableRow key={review.id} className={review.isAlert ? 'bg-red-50' : ''}>
                  <TableCell className="font-medium text-sm">{review.skuMaster?.name ?? '-'}</TableCell>
                  <TableCell><Badge variant="outline">{review.channel}</Badge></TableCell>
                  <TableCell>{'★'.repeat(review.rating ?? 0)}</TableCell>
                  <TableCell>
                    <Badge variant={review.sentiment === 'positive' ? 'default' : review.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                      {review.sentiment === 'positive' ? '긍정' : review.sentiment === 'negative' ? '부정' : '중립'}
                    </Badge>
                    {review.isAlert && <AlertTriangle className="w-3 h-3 text-red-500 inline ml-1" />}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {(review.tags ?? []).slice(0, 3).map(tag => <span key={tag} className="text-xs bg-gray-100 rounded px-1">{tag}</span>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-48 truncate">{review.content ?? '-'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(review.ingestedAt).toLocaleDateString('ko-KR')}</TableCell>
                </TableRow>
              ))}
              {(!data?.recentReviews || data.recentReviews.length === 0) && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">리뷰 데이터가 없습니다.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
