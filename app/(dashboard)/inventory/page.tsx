'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, AlertTriangle, Plus } from 'lucide-react'

type Sku = {
  id: string
  skuCode: string
  name: string
  category: string
  isBundle: boolean
  lotExpiry: string | null
  _count: { inventory: number; aliases: number }
}

export default function InventoryPage() {
  const [skus, setSkus] = useState<Sku[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sku').then(r => r.json()).then((d: { data: Sku[] }) => { setSkus(d.data ?? []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const isExpiringSoon = (date: string | null) => {
    if (!date) return false
    const days = (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return days <= 30
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">재고 · SKU 관리</h1>
          <p className="text-muted-foreground mt-1">SKU 마스터 및 채널별 재고 현황</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />SKU 등록</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="SKU 코드 또는 상품명" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU 코드</TableHead>
                <TableHead>상품명</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>세트 여부</TableHead>
                <TableHead>유통기한</TableHead>
                <TableHead>채널 재고</TableHead>
                <TableHead>채널 매핑</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skus.filter(s => !search || s.skuCode.includes(search) || s.name.includes(search)).map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-sm">{s.skuCode}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell><Badge variant="outline">{s.category}</Badge></TableCell>
                  <TableCell>{s.isBundle ? <Badge>세트</Badge> : '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {s.lotExpiry ? new Date(s.lotExpiry).toLocaleDateString('ko-KR') : '-'}
                      {isExpiringSoon(s.lotExpiry) && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                    </div>
                  </TableCell>
                  <TableCell>{s._count.inventory}개 채널</TableCell>
                  <TableCell>{s._count.aliases}개</TableCell>
                  <TableCell><Button variant="ghost" size="sm">상세</Button></TableCell>
                </TableRow>
              ))}
              {!loading && skus.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">SKU가 없습니다.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
