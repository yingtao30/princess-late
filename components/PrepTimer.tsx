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
      Notification.requestPermission().then((p) => {
        notifGranted.current = p === 'granted'
      })
    }
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const phase: Phase =
    now >= departureTime ? 'departed'
    : now >= alertTime ? 'alert'
    : now >= prepStartTime ? 'preparing'
    : 'waiting'

  // Fire notification once on alert phase
  useEffect(() => {
    if (phase === 'alert' && !notifiedRef.current) {
      notifiedRef.current = true
      if (notifGranted.current) {
        new Notification('👸 출발 3분 전!', {
          body: '지금 당장 나가세요! 공주님!',
        })
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

      {/* Phase banner */}
      {phase === 'waiting' && (
        <div className="rounded-2xl bg-pink-50 border border-pink-200 p-4 text-center">
          <p className="text-rose-400 font-medium">준비 시작까지</p>
          <p className="text-3xl font-black text-rose-500 mt-1">{formatHMS(msUntilPrep)}</p>
          <p className="text-xs text-pink-300 mt-1">{formatTime(prepStartTime)}에 준비를 시작하세요</p>
        </div>
      )}

      {phase === 'preparing' && (
        <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-100 border border-rose-200 p-4 text-center">
          <p className="text-rose-400 font-medium">💅 지금 준비 중!</p>
          <p className="text-3xl font-black text-rose-500 mt-1">{formatHMS(msUntilDep)}</p>
          <p className="text-xs text-pink-400 mt-1">출발까지 남은 시간</p>
        </div>
      )}

      {phase === 'alert' && (
        <div className="rounded-2xl bg-rose-400 border-2 border-rose-500 p-5 text-center relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-rose-300/30 animate-ping-slow" />
          <p className="text-white font-bold text-lg relative">🚨 출발 3분 전!</p>
          <p className="text-4xl font-black text-white mt-1 relative">{formatHMS(msUntilDep)}</p>
          <p className="text-rose-100 text-sm mt-1 relative animate-wiggle inline-block">
            지금 당장 나가요!!
          </p>
        </div>
      )}

      {phase === 'departed' && (
        <div className="rounded-2xl bg-red-100 border-2 border-red-300 p-4 text-center">
          <p className="text-3xl mb-1">😱</p>
          <p className="text-red-500 font-bold">이미 출발했어야 해요!</p>
          <p className="text-2xl font-black text-red-400 mt-1">{formatHMS(-msUntilDep)} 지났어요</p>
        </div>
      )}

      {/* Progress bar */}
      {phase !== 'waiting' && phase !== 'departed' && (
        <div>
          <div className="flex justify-between text-xs text-pink-400 mb-1.5 px-1">
            <span>준비 시작 {formatTime(prepStartTime)}</span>
            <span>출발 {formatTime(departureTime)}</span>
          </div>
          <div className="h-3 rounded-full bg-pink-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                phase === 'alert'
                  ? 'bg-gradient-to-r from-rose-400 to-red-400'
                  : 'bg-gradient-to-r from-rose-300 to-pink-400'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-xs text-pink-300 mt-1">{Math.round(progress)}% 완료</p>
        </div>
      )}

      {/* Status pills */}
      <div className="grid grid-cols-2 gap-3">
        <InfoPill label="약속 시간" value={formatTime(new Date(departureTime.getTime() + (groomingMinutes + travelMinutes) * 60 * 1000))} />
        <InfoPill label="출발 시간" value={formatTime(departureTime)} accent />
      </div>

      <button
        onClick={onBack}
        className="w-full rounded-xl border-2 border-pink-200 bg-white/60 text-pink-400
                   font-medium py-3 hover:bg-pink-50 transition-colors duration-200"
      >
        ← 다시 설정하기
      </button>
    </div>
  )
}

function InfoPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-3 text-center border ${accent ? 'bg-rose-50 border-rose-200' : 'bg-white/60 border-pink-100'}`}>
      <p className="text-xs text-pink-400">{label}</p>
      <p className={`font-bold text-sm mt-0.5 ${accent ? 'text-rose-500' : 'text-rose-700'}`}>{value}</p>
    </div>
  )
}
