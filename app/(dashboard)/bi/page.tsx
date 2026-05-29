'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, ShoppingCart, RotateCcw, DollarSign } from 'lucide-react'

const mockSalesData = [
  { month: '1월', 자사몰: 85000000, 쿠팡: 62000000, 올리브영: 45000000, 네이버: 22000000 },
  { month: '2월', 자사몰: 92000000, 쿠팡: 58000000, 올리브영: 48000000, 네이버: 25000000 },
  { month: '3월', 자사몰: 98000000, 쿠팡: 72000000, 올리브영: 52000000, 네이버: 25500000 },
]

const channelColors = { 자사몰: '#ec4899', 쿠팡: '#3b82f6', 올리브영: '#22c55e', 네이버: '#f59e0b' }

const sentimentData = [
  { name: '긍정', value: 68, color: '#22c55e' },
  { name: '중립', value: 22, color: '#94a3b8' },
  { name: '부정', value: 10, color: '#ef4444' },
]

export default function BIPage() {
  const [salesData, setSalesData] = useState<Record<string, unknown> | null>(null)
  const [customerData, setCustomerData] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    fetch('/api/bi/sales').then(r => r.json()).then(d => setSalesData(d as Record<string, unknown>)).catch(() => {})
    fetch('/api/bi/customers').then(r => r.json()).then(d => setCustomerData(d as Record<string, unknown>)).catch(() => {})
  }, [])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">BI 대시보드</h1>
        <p className="text-muted-foreground mt-1">채널 통합 매출 및 KPI 분석</p>
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">매출 분석</TabsTrigger>
          <TabsTrigger value="customers">고객 KPI</TabsTrigger>
          <TabsTrigger value="marketing">마케팅 KPI</TabsTrigger>
          <TabsTrigger value="scm">SCM KPI</TabsTrigger>
          <TabsTrigger value="voc">VOC 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-4 space-y-6">
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: '총 매출', value: salesData ? `₩${Number(salesData.totalRevenue ?? 0).toLocaleString()}` : '₩248,500,000', icon: DollarSign },
              { label: '총 주문', value: salesData ? `${salesData.totalOrders}건` : '1,847건', icon: ShoppingCart },
              { label: '평균 객단가', value: salesData ? `₩${Number(salesData.avgOrderValue ?? 0).toLocaleString()}` : '₩134,540', icon: TrendingUp },
              { label: '신규 고객', value: salesData ? `${salesData.newCustomers}명` : '342명', icon: Users },
              { label: '반품률', value: salesData ? `${salesData.returnRate}%` : '3.2%', icon: RotateCcw },
            ].map(kpi => (
              <Card key={kpi.label}>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">{kpi.label}</div>
                  <div className="text-xl font-bold">{kpi.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle>월별 채널별 매출 추이</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(v: number) => `₩${v.toLocaleString()}`} />
                  <Legend />
                  {Object.entries(channelColors).map(([key, color]) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>채널별 매출 비교</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(v: number) => `₩${v.toLocaleString()}`} />
                  <Legend />
                  {Object.entries(channelColors).map(([key, color]) => (
                    <Bar key={key} dataKey={key} fill={color} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="mt-4 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: '전체 고객', value: customerData ? `${Number(customerData.totalCustomers ?? 0).toLocaleString()}명` : '12,481명' },
              { label: '평균 LTV', value: customerData ? `₩${Number(customerData.avgLtv ?? 0).toLocaleString()}` : '₩198,400' },
              { label: '재구매율', value: customerData ? `${customerData.repeatRate}%` : '42.3%' },
              { label: '이탈 위험', value: customerData ? `${customerData.churnRiskCount}명` : '1,243명' },
            ].map(kpi => (
              <Card key={kpi.label}><CardContent className="p-4"><div className="text-sm text-muted-foreground">{kpi.label}</div><div className="text-xl font-bold mt-1">{kpi.value}</div></CardContent></Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="mt-4">
          <Card>
            <CardHeader><CardTitle>캠페인 성과</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">캠페인 데이터를 불러오는 중...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scm" className="mt-4">
          <Card>
            <CardHeader><CardTitle>SCM 현황</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">재고 데이터를 불러오는 중...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voc" className="mt-4 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>감성 분포</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name} ${value}%`}>
                      {sentimentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>키워드 TOP 10</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['수분감 좋음', '발림성', '끈적거림', '향기', '자외선 차단', '미백 효과', '트러블 개선', '피부 결', '흡수력', '텍스처'].map((tag, i) => (
                    <div key={tag} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                      <div className="flex-1 h-5 bg-gray-100 rounded">
                        <div className="h-5 bg-pink-400 rounded text-xs text-white flex items-center px-2" style={{ width: `${90 - i * 7}%` }}>{tag}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
