'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UserPlus, Search } from 'lucide-react'

type User = { id: string; name: string | null; email: string; role: string; isActive: boolean; lastLoginAt: string | null; group: { name: string } | null }

const ROLE_LABELS: Record<string, string> = {
  super_admin: '슈퍼 관리자',
  admin: '관리자',
  manager: '매니저',
  member: '멤버',
  viewer: '뷰어',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(`/api/admin/users?search=${search}`)
      .then(r => r.json())
      .then(d => setUsers(d as User[]))
      .catch(() => {})
  }, [search])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">계정 관리</h1>
          <p className="text-muted-foreground mt-1">사용자 계정 및 권한 관리</p>
        </div>
        <Button><UserPlus className="w-4 h-4 mr-2" />계정 초대</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="이름 또는 이메일" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>그룹</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>마지막 로그인</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name ?? '-'}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell><Badge variant="outline">{ROLE_LABELS[u.role] ?? u.role}</Badge></TableCell>
                  <TableCell>{u.group?.name ?? '-'}</TableCell>
                  <TableCell><Badge variant={u.isActive ? 'default' : 'destructive'}>{u.isActive ? '활성' : '비활성'}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('ko-KR') : '-'}</TableCell>
                  <TableCell><Button variant="ghost" size="sm">수정</Button></TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">계정이 없습니다.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
