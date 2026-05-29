import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, ShoppingBag, Package, Megaphone, GitBranch, Star, MessageSquare, BarChart3, Settings, Shield, LogOut } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/dashboard/customers', label: '고객 관리', icon: Users },
  { href: '/dashboard/sales', label: '영업 파이프라인', icon: ShoppingBag },
  { href: '/dashboard/inventory', label: '재고 · SKU', icon: Package },
  { href: '/dashboard/campaigns', label: '캠페인', icon: Megaphone },
  { href: '/dashboard/journeys', label: '여정 자동화', icon: GitBranch },
  { href: '/dashboard/influencers', label: '인플루언서', icon: Star },
  { href: '/dashboard/voc', label: 'VOC · 리뷰', icon: MessageSquare },
  { href: '/dashboard/bi', label: 'BI 대시보드', icon: BarChart3 },
]

const adminItems = [
  { href: '/dashboard/admin/users', label: '계정 관리', icon: Shield },
  { href: '/dashboard/admin/api', label: 'API 연결', icon: Settings },
  { href: '/dashboard/admin/logs', label: '감사 로그', icon: Shield },
  { href: '/dashboard/admin/settings', label: '시스템 설정', icon: Settings },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  const isAdmin = ['super_admin', 'admin'].includes((session.user as { role?: string }).role ?? '')

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">B</div>
            <div>
              <div className="font-bold text-sm">Flowit CRM</div>
              <div className="text-xs text-muted-foreground">{session.user.name}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <>
              <div className="pt-4 pb-2 px-3 text-xs font-semibold text-muted-foreground uppercase">관리자</div>
              {adminItems.map(item => (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>
        <div className="p-4 border-t">
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-100 transition-colors">
            <LogOut className="w-4 h-4" />
            로그아웃
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
