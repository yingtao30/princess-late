'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  departureTime: Date
  groomingMinutes: number
  travelMinutes: number
  onBack: () => void
}

type Phase = 'waiting' | 'preparing' | 'alert' | 'departed'

function formatHMS(ms: number): string {
  if (ms <= 0) return '00:00:00'
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [h, m, sec].map((v) => String(v).padStart(2, '0')).join(':')
}

function formatTime(date: Date): string {
  const h = date.getHours()
  const m = date.getMinutes()
  const ampm = h < 12 ? '오전' : '오후'
  const dh = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${ampm} ${dh}:${String(m).padStart(2, '0')}`
}

export default function PrepTimer({ departureTime, groomingMinutes, travelMinutes, onBack }: Props) {
  const [now, setNow] = useState(() => new Date())
  const notifiedRef = useRef(false)
  const notifGranted = useRef(false)

  const prepStartTime = new Date(departureTime.getTime() - groomingMinutes * 60 * 1000)
  const alertTime = new Date(departureTime.getTime() - 3 * 60 * 1000)

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then((p) => { notifGranted.current = p === 'granted' })
    }
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const phase: Phase =
    now >= departureTime ? 'departed'
    : now >= alertTime ? 'alert'
    : now >= prepStartTime ? 'preparing'
    : 'waiting'

  useEffect(() => {
    if (phase === 'alert' && !notifiedRef.current) {
      notifiedRef.current = true
      if (notifGranted.current) {
        new Notification('출발 3분 전!', { body: '지금 당장 나가세요!' })
      }
    }
  }, [phase])

  const msUntilDep = departureTime.getTime() - now.getTime()
  const msUntilPrep = prepStartTime.getTime() - now.getTime()
  const total = departureTime.getTime() - prepStartTime.getTime()
  const elapsed = now.getTime() - prepStartTime.getTime()
  const progress = phase === 'waiting' ? 0
    : phase === 'departed' ? 100
    : Math.min(100, Math.max(0, (elapsed / total) * 100))

  return (
    <div className="animate-fade-in-up space-y-5">

      {phase === 'waiting' && (
        <div className="rounded-2xl p-4 text-center border" style={{ background: '#F9FAFB', borderColor: '#F2F4F6' }}>
          <p className="text-sm font-medium" style={{ color: '#8B95A1' }}>준비 시작까지</p>
          <p className="text-3xl font-black mt-1" style={{ color: '#191F28' }}>{formatHMS(msUntilPrep)}</p>
          <p className="text-xs mt-1" style={{ color: '#B0B8C1' }}>{formatTime(prepStartTime)}에 준비를 시작하세요</p>
        </div>
      )}

      {phase === 'preparing' && (
        <div className="rounded-2xl p-4 text-center border" style={{ background: '#FFF0F5', borderColor: '#FECDD3' }}>
          <p className="text-sm font-medium" style={{ color: '#6B7684' }}>지금 준비 중!</p>
          <p className="text-3xl font-black mt-1" style={{ color: '#191F28' }}>{formatHMS(msUntilDep)}</p>
          <p className="text-xs mt-1" style={{ color: '#8B95A1' }}>출발까지 남은 시간</p>
        </div>
      )}

      {phase === 'alert' && (
        <div className="rounded-2xl p-5 text-center relative overflow-hidden" style={{ background: '#f43f5e' }}>
          <div className="absolute inset-0 rounded-2xl animate-ping-slow" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <p className="text-white font-bold text-lg relative">출발 3분 전!</p>
          <p className="text-4xl font-black text-white mt-1 relative">{formatHMS(msUntilDep)}</p>
          <p className="text-rose-100 text-sm mt-1 relative animate-wiggle inline-block">지금 당장 나가요!</p>
        </div>
      )}

      {phase === 'departed' && (
        <div className="rounded-2xl p-4 text-center border" style={{ background: '#FFF2F2', borderColor: '#FFCDD2' }}>
          <p className="text-2xl font-black mt-1" style={{ color: '#E53935' }}>{formatHMS(-msUntilDep)} 지났어요</p>
          <p className="font-bold mt-1" style={{ color: '#E53935' }}>이미 출발했어야 해요!</p>
        </div>
      )}

      {/* Progress bar */}
      {phase !== 'waiting' && phase !== 'departed' && (
        <div>
          <div className="flex justify-between text-xs mb-1.5 px-1" style={{ color: '#8B95A1' }}>
            <span>준비 시작 {formatTime(prepStartTime)}</span>
            <span>출발 {formatTime(departureTime)}</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#F2F4F6' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progress}%`,
                background: phase === 'alert' ? '#f43f5e' : '#191F28',
              }}
            />
          </div>
          <p className="text-center text-xs mt-1" style={{ color: '#B0B8C1' }}>{Math.round(progress)}% 완료</p>
        </div>
      )}

      {/* Info pills */}
      <div className="grid grid-cols-2 gap-3">
        <InfoPill label="약속 시간" value={formatTime(new Date(departureTime.getTime() + (groomingMinutes + travelMinutes) * 60 * 1000))} />
        <InfoPill label="출발 시간" value={formatTime(departureTime)} accent />
      </div>

      <button
        onClick={onBack}
        className="w-full rounded-xl py-3 font-medium text-sm transition-colors duration-200 border"
        style={{ background: '#ffffff', borderColor: '#F2F4F6', color: '#6B7684' }}
      >
        다시 설정하기
      </button>
    </div>
  )
}

function InfoPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl p-3 text-center border" style={{ background: accent ? '#FFF0F5' : '#F9FAFB', borderColor: accent ? '#FECDD3' : '#F2F4F6' }}>
      <p className="text-xs" style={{ color: '#8B95A1' }}>{label}</p>
      <p className="font-bold text-sm mt-0.5" style={{ color: '#191F28' }}>{value}</p>
    </div>
  )
}
