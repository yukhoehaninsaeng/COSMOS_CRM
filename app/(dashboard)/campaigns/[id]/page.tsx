'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Stats = {
  total: number
  opened: number
  clicked: number
  converted: number
  openRate: string
  clickRate: string
  conversionRate: string
  totalRevenue: number
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch(`/api/campaigns/${id}/stats`).then(r => r.json()).then(d => setStats(d as Stats)).catch(() => {})
  }, [id])

  const funnelData = stats ? [
    { label: '발송', count: stats.total, color: 'bg-blue-500' },
    { label: '오픈', count: stats.opened, color: 'bg-green-500' },
    { label: '클릭', count: stats.clicked, color: 'bg-yellow-500' },
    { label: '전환', count: stats.converted, color: 'bg-red-500' },
  ] : []

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/campaigns" className="text-muted-foreground hover:text-gray-900"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold">캠페인 상세</h1>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats && [
          { label: '총 발송', value: stats.total.toLocaleString() },
          { label: '오픈율', value: `${stats.openRate}%` },
          { label: '클릭율', value: `${stats.clickRate}%` },
          { label: '전환율', value: `${stats.conversionRate}%` },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="text-sm text-muted-foreground">{kpi.label}</div><div className="text-2xl font-bold mt-1">{kpi.value}</div></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>발송 퍼널</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {funnelData.map((step, i) => (
              <div key={step.label}>
                <div className="flex justify-between text-sm mb-1"><span>{step.label}</span><span className="font-medium">{step.count.toLocaleString()}명</span></div>
                <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div className={`h-8 ${step.color} rounded-lg flex items-center px-3 text-white text-sm font-medium`} style={{ width: funnelData[0]?.count ? `${(step.count / funnelData[0].count) * 100}%` : '0%' }}>
                    {funnelData[0]?.count ? `${((step.count / funnelData[0].count) * 100).toFixed(1)}%` : '-'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!stats && <p className="text-muted-foreground text-sm text-center py-4">통계 데이터가 없습니다.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
