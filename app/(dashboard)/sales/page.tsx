'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, AlertCircle } from 'lucide-react'

type Deal = {
  id: string
  title: string
  company: string
  amount: number
  probability: number
  dueDate: string
  assignee: string
  isOverdue?: boolean
}

const STAGES = [
  { id: 'lead', label: '리드 발굴', color: 'bg-gray-100' },
  { id: 'meeting', label: '미팅 진행', color: 'bg-blue-50' },
  { id: 'quote', label: '견적 협의', color: 'bg-yellow-50' },
  { id: 'contract', label: '계약 검토', color: 'bg-orange-50' },
  { id: 'closed', label: '수주 완료', color: 'bg-green-50' },
]

const MOCK_DEALS: Record<string, Deal[]> = {
  lead: [
    { id: '1', title: '스킨케어 라인 입점', company: '올리브영 강남점', amount: 12000000, probability: 30, dueDate: '2026-06-15', assignee: '김영업' },
    { id: '2', title: '선케어 특판', company: '쿠팡 로켓', amount: 8500000, probability: 20, dueDate: '2026-05-20', assignee: '이담당', isOverdue: true },
  ],
  meeting: [
    { id: '3', title: '세럼 B2B 계약', company: 'ABC홀세일', amount: 45000000, probability: 60, dueDate: '2026-06-30', assignee: '박매니저' },
  ],
  quote: [
    { id: '4', title: '기초케어 세트 납품', company: '헬스앤뷰티코리아', amount: 32000000, probability: 75, dueDate: '2026-06-10', assignee: '김영업' },
  ],
  contract: [],
  closed: [
    { id: '5', title: '여름 선케어 패키지', company: '드럭스토어체인', amount: 58000000, probability: 100, dueDate: '2026-05-01', assignee: '이담당' },
  ],
}

export default function SalesPage() {
  const [deals, setDeals] = useState(MOCK_DEALS)

  const totalPipeline = Object.values(deals).flat().reduce((s, d) => s + d.amount * (d.probability / 100), 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">영업 파이프라인</h1>
          <p className="text-muted-foreground mt-1">B2B 딜 관리 · 예상 수주액: ₩{totalPipeline.toLocaleString()}</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />딜 추가</Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => (
          <div key={stage.id} className={`w-72 shrink-0 ${stage.color} rounded-lg p-3`}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm">{stage.label}</span>
              <Badge variant="secondary">{(deals[stage.id] ?? []).length}</Badge>
            </div>
            <div className="space-y-2">
              {(deals[stage.id] ?? []).map(deal => (
                <Card key={deal.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-medium text-sm">{deal.title}</span>
                      {deal.isOverdue && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{deal.company}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">₩{(deal.amount / 1000000).toFixed(0)}M</span>
                      <span className="text-xs bg-gray-200 rounded px-1">{deal.probability}%</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>{deal.assignee}</span>
                      <span className={deal.isOverdue ? 'text-red-500' : ''}>{new Date(deal.dueDate).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground"><Plus className="w-3 h-3 mr-1" />딜 추가</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
