import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Users, ShoppingCart, Package, RotateCcw, DollarSign } from 'lucide-react'

const kpiData = [
  { title: '총 매출', value: '₩248,500,000', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-green-600' },
  { title: '총 주문 수', value: '1,847건', change: '+8.3%', trend: 'up', icon: ShoppingCart, color: 'text-blue-600' },
  { title: '평균 객단가', value: '₩134,540', change: '+3.8%', trend: 'up', icon: TrendingUp, color: 'text-purple-600' },
  { title: '신규 고객', value: '342명', change: '-2.1%', trend: 'down', icon: Users, color: 'text-orange-600' },
  { title: '반품률', value: '3.2%', change: '-0.5%', trend: 'up', icon: RotateCcw, color: 'text-red-600' },
]

const recentActivity = [
  { time: '10분 전', text: '쿠팡 주문 127건 동기화 완료' },
  { time: '32분 전', text: 'VOC 이상 징후 감지: 세럼 50mL (부정 리뷰 18%)' },
  { time: '1시간 전', text: 'VIP 세그먼트 재분류 완료 (3,421명)' },
  { time: '2시간 전', text: '재고 부족 경고: TONER-200 (네이버 재고 5개)' },
  { time: '3시간 전', text: '여정 "이탈 위험 리텐션" 84명 등록 완료' },
]

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-muted-foreground mt-1">BeautyFlow CRM 현황 요약</p>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-8">
        {kpiData.map(kpi => (
          <Card key={kpi.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">{kpi.title}</span>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className={`text-sm mt-1 flex items-center gap-1 ${kpi.trend === 'up' && !kpi.title.includes('반품') ? 'text-green-600' : 'text-red-500'}`}>
                {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change} 전월 대비
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader><CardTitle>채널별 매출 현황 (이번 달)</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { channel: '자사몰', amount: '₩98,200,000', ratio: 39, color: 'bg-pink-500' },
                { channel: '쿠팡', amount: '₩72,500,000', ratio: 29, color: 'bg-blue-500' },
                { channel: '올리브영', amount: '₩52,300,000', ratio: 21, color: 'bg-green-500' },
                { channel: '네이버', amount: '₩25,500,000', ratio: 10, color: 'bg-yellow-500' },
              ].map(item => (
                <div key={item.channel}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.channel}</span>
                    <span>{item.amount} ({item.ratio}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className={`h-2 ${item.color} rounded-full`} style={{ width: `${item.ratio}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>최근 활동</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-muted-foreground shrink-0 w-16">{activity.time}</span>
                  <span className="text-gray-700">{activity.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
