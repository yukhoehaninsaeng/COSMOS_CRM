'use client'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Star } from 'lucide-react'

const MOCK_INFLUENCERS = [
  { id: '1', name: '뷰티인플루', channel: 'instagram', handle: '@beautyinflu', followerCnt: 250000, avgEngagement: 4.2, avgRoi: 3.8, categoryFocus: ['skincare', 'suncare'] },
  { id: '2', name: '메이크업크리에이터', channel: 'youtube', handle: 'makeupstudio', followerCnt: 480000, avgEngagement: 6.1, avgRoi: 5.2, categoryFocus: ['makeup'] },
  { id: '3', name: '피부고민해결사', channel: 'blog', handle: 'skincareblog', followerCnt: 95000, avgEngagement: 8.3, avgRoi: 4.1, categoryFocus: ['skincare'] },
]

export default function InfluencersPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">인플루언서 CRM</h1>
          <p className="text-muted-foreground mt-1">인플루언서 관리 및 캠페인 ROI 추적</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />인플루언서 등록</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>채널</TableHead>
                <TableHead>핸들</TableHead>
                <TableHead>팔로워</TableHead>
                <TableHead>평균 인게이지먼트</TableHead>
                <TableHead>평균 ROI</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INFLUENCERS.map(inf => (
                <TableRow key={inf.id}>
                  <TableCell className="font-medium">{inf.name}</TableCell>
                  <TableCell><Badge variant="outline">{inf.channel}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{inf.handle}</TableCell>
                  <TableCell>{(inf.followerCnt / 1000).toFixed(0)}K</TableCell>
                  <TableCell>{inf.avgEngagement}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{inf.avgRoi}x</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">{inf.categoryFocus.map(c => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)}</div>
                  </TableCell>
                  <TableCell><Button variant="ghost" size="sm">캠페인 연결</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
