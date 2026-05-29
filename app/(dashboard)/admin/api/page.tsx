'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, RefreshCw } from 'lucide-react'

type ApiConnection = {
  id: string
  name: string
  channel: string
  endpoint: string
  status: string
  lastLatencyMs: number | null
  lastCheckedAt: string | null
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  connected: { label: '연결됨', color: 'bg-green-100 text-green-700' },
  delayed: { label: '지연', color: 'bg-yellow-100 text-yellow-700' },
  error: { label: '오류', color: 'bg-red-100 text-red-700' },
  disconnected: { label: '미연결', color: 'bg-gray-100 text-gray-700' },
}

export default function AdminApiPage() {
  const [connections, setConnections] = useState<ApiConnection[]>([])

  useEffect(() => {
    fetch('/api/admin/api-connections').then(r => r.json()).then(d => setConnections(d as ApiConnection[])).catch(() => {})
  }, [])

  const testConnection = async (id: string) => {
    const res = await fetch(`/api/admin/api-connections/${id}/test`, { method: 'POST' })
    const data = await res.json() as { status: string }
    setConnections(prev => prev.map(c => c.id === id ? { ...c, status: data.status } : c))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">API 연결 관리</h1>
          <p className="text-muted-foreground mt-1">채널 API 연결 상태 모니터링</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />API 연결 추가</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>채널</TableHead>
                <TableHead>엔드포인트</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>응답시간</TableHead>
                <TableHead>마지막 확인</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connections.map(c => {
                const statusConf = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.disconnected
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.channel}</TableCell>
                    <TableCell className="text-xs text-muted-foreground truncate max-w-48">{c.endpoint}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConf.color}`}>{statusConf.label}</span></TableCell>
                    <TableCell>{c.lastLatencyMs ? `${c.lastLatencyMs}ms` : '-'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.lastCheckedAt ? new Date(c.lastCheckedAt).toLocaleString('ko-KR') : '-'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => testConnection(c.id)}><RefreshCw className="w-3 h-3 mr-1" />테스트</Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {connections.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">연결된 API가 없습니다.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
