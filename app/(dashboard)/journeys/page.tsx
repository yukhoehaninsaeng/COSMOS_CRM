'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Play, Pause, GitBranch } from 'lucide-react'

const TEMPLATES = [
  { name: '신규 고객 온보딩', trigger: 'signup', steps: 4, description: '가입 → D+3 샘플 추천 → D+7 리뷰 요청 → D+14 첫 구매 쿠폰' },
  { name: '이탈 위험 리텐션', trigger: 'segment_enter', steps: 5, description: '세그먼트 진입 → D+0 감성 메시지 → D+7 쿠폰 → D+14 만료 알림' },
  { name: '재구매 리마인더', trigger: 'purchase', steps: 3, description: '예상 사용주기 도래 → 리마인더 → 미구매 시 추가 할인' },
  { name: 'VIP 전환 축하', trigger: 'rfm_change', steps: 2, description: 'VIP 세그먼트 진입 → 등급 안내 + 전용 혜택' },
]

export default function JourneysPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'templates'>('list')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">여정 자동화</h1>
          <p className="text-muted-foreground mt-1">고객 여정 자동화 관리</p>
        </div>
        <div className="flex gap-2">
          <Button variant={activeTab === 'list' ? 'default' : 'outline'} onClick={() => setActiveTab('list')}>여정 목록</Button>
          <Button variant={activeTab === 'templates' ? 'default' : 'outline'} onClick={() => setActiveTab('templates')}>템플릿</Button>
          <Button><Plus className="w-4 h-4 mr-2" />새 여정</Button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="text-center py-16 text-muted-foreground">
          <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>활성 여정이 없습니다. 템플릿으로 시작하세요.</p>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-2 gap-4">
          {TEMPLATES.map(t => (
            <Card key={t.name} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                  </div>
                  <Badge variant="outline">{t.steps}단계</Badge>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Badge variant="secondary">트리거: {t.trigger}</Badge>
                  <Button size="sm"><Play className="w-3 h-3 mr-1" />사용하기</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
