'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download } from 'lucide-react'

type AuditLog = {
  id: string
  action: string
  resource: string
  resourceId: string | null
  ip: string | null
  createdAt: string
  user: { name: string | null; email: string } | null
  payloadBefore: Record<string, unknown> | null
  payloadAfter: Record<string, unknown> | null
}

const DANGER_ACTIONS = ['DELETE', 'EXPORT']

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [selected, setSelected] = useState<AuditLog | null>(null)
  const [action, setAction] = useState('')

  useEffect(() => {
    fetch(`/api/admin/audit-logs?${action ? `action=${action}` : ''}`)
      .then(r => r.json())
      .then((d: { data: AuditLog[] }) => setLogs(d.data ?? []))
      .catch(() => {})
  }, [action])

  const handleExport = () => { window.open('/api/admin/audit-logs/export') }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">감사 로그</h1>
          <p className="text-muted-foreground mt-1">모든 사용자 액션 이력</p>
        </div>
        <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2" />CSV 내보내기</Button>
      </div>

      <div className="flex gap-4">
        <Card className="flex-1">
          <CardHeader>
            <select className="border rounded-md px-3 py-2 text-sm w-48" value={action} onChange={e => setAction(e.target.value)}>
              <option value="">전체 액션</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="LOGIN">LOGIN</option>
              <option value="EXPORT">EXPORT</option>
            </select>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>시각</TableHead>
                  <TableHead>사용자</TableHead>
                  <TableHead>액션</TableHead>
                  <TableHead>리소스</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(log => (
                  <TableRow
                    key={log.id}
                    className={`cursor-pointer ${DANGER_ACTIONS.includes(log.action) ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelected(log)}
                  >
                    <TableCell className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString('ko-KR')}</TableCell>
                    <TableCell>{log.user?.name ?? log.user?.email ?? '-'}</TableCell>
                    <TableCell><Badge variant={DANGER_ACTIONS.includes(log.action) ? 'destructive' : 'outline'}>{log.action}</Badge></TableCell>
                    <TableCell className="text-sm">{log.resource} {log.resourceId ? `#${log.resourceId.slice(0, 8)}` : ''}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.ip}</TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">로그가 없습니다.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selected && (
          <Card className="w-80 shrink-0">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-sm">상세 정보</span>
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>✕</Button>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">액션:</span> <Badge variant="outline">{selected.action}</Badge></div>
                <div><span className="text-muted-foreground">리소스:</span> {selected.resource}</div>
                <div><span className="text-muted-foreground">IP:</span> {selected.ip}</div>
                {selected.payloadAfter && (
                  <div>
                    <div className="text-muted-foreground mb-1">변경 후:</div>
                    <pre className="bg-gray-50 rounded p-2 text-xs overflow-auto max-h-48">{JSON.stringify(selected.payloadAfter, null, 2)}</pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
