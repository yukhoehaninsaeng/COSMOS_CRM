'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    lowStockThreshold: '20',
    negativeReviewRatio: '15',
    negativeReviewCount: '10',
    syncInterval: '15',
    maxDailySends: '1',
    rawDataRetention: '90',
    auditLogRetention: '365',
  })

  const handleSave = () => {
    alert('설정이 저장되었습니다.')
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">시스템 설정</h1>
        <p className="text-muted-foreground mt-1">운영 파라미터 및 정책 설정</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>재고 알림</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>재고 부족 임계값 (%)</Label>
              <Input type="number" value={settings.lowStockThreshold} onChange={e => setSettings(p => ({ ...p, lowStockThreshold: e.target.value }))} />
              <p className="text-xs text-muted-foreground">현재 재고가 이 비율 이하일 때 알림 발송</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>VOC 이상 징후</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>부정 리뷰 비율 임계값 (%)</Label>
              <Input type="number" value={settings.negativeReviewRatio} onChange={e => setSettings(p => ({ ...p, negativeReviewRatio: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>1일 부정 리뷰 건수 임계값</Label>
              <Input type="number" value={settings.negativeReviewCount} onChange={e => setSettings(p => ({ ...p, negativeReviewCount: e.target.value }))} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>캠페인 발송 제한</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>동일 고객 하루 최대 발송 횟수</Label>
              <Input type="number" value={settings.maxDailySends} onChange={e => setSettings(p => ({ ...p, maxDailySends: e.target.value }))} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>데이터 보존 정책</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>채널 원시 데이터 보존 기간 (일)</Label>
              <Input type="number" value={settings.rawDataRetention} onChange={e => setSettings(p => ({ ...p, rawDataRetention: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>감사 로그 DB 보존 기간 (일)</Label>
              <Input type="number" value={settings.auditLogRetention} onChange={e => setSettings(p => ({ ...p, auditLogRetention: e.target.value }))} />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">설정 저장</Button>
      </div>
    </div>
  )
}
