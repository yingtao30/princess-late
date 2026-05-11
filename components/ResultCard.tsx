'use client'

const GROOMING_LABELS: Record<number, string> = {
  1: '🌸 순수 민낯 (10분)',
  2: '💄 자연스럽게 (30분)',
  3: '✨ 요염하게 (1시간)',
  4: '👑 완벽한 공주 (1시간 30분)',
}

function formatTime(date: Date) {
  const h = date.getHours()
  const m = date.getMinutes()
  const ampm = h < 12 ? '오전' : '오후'
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${ampm} ${displayH}:${String(m).padStart(2, '0')}`
}

function formatMinutes(min: number) {
  if (min < 60) return `${min}분`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`
}

interface Props {
  groomingLevel: number
  groomingMinutes: number
  appointmentTime: Date
  travelMinutes: number
  departureTime: Date
  onStartTimer: () => void
}

export default function ResultCard({
  groomingLevel,
  groomingMinutes,
  appointmentTime,
  travelMinutes,
  departureTime,
  onStartTimer,
}: Props) {
  const isPast = departureTime < new Date()

  return (
    <div className="animate-fade-in-up space-y-4">
      <h2 className="text-center text-xl font-bold text-rose-500 mb-1">출발 시간 계산 완료!</h2>
      <p className="text-center text-sm text-pink-400 mb-4">
        {isPast ? '앗, 이미 지났어요 😱 어떡하죠?' : '공주님, 지각 없이 가봐요 ✨'}
      </p>

      {/* Big departure time */}
      <div
        className={`
          rounded-3xl p-6 text-center border-2
          ${isPast
            ? 'bg-red-50 border-red-200'
            : 'bg-gradient-to-br from-rose-50 to-pink-100 border-rose-200'
          }
        `}
      >
        <p className="text-sm text-pink-400 mb-1">지금 당장 출발해야 할 시간</p>
        <p className={`text-5xl font-black tracking-tight ${isPast ? 'text-red-400' : 'text-rose-500'}`}>
          {formatTime(departureTime)}
        </p>
        {isPast && (
          <p className="mt-2 text-sm font-medium text-red-400 animate-wiggle inline-block">
            이미 지났어요!!
          </p>
        )}
      </div>

      {/* Summary */}
      <div className="rounded-2xl bg-white/60 border border-pink-100 divide-y divide-pink-100">
        <Row label="약속 시간" value={formatTime(appointmentTime)} />
        <Row label="꾸밈 단계" value={GROOMING_LABELS[groomingLevel]} />
        <Row label="이동 시간" value={formatMinutes(travelMinutes)} />
        <Row label="총 필요 시간" value={formatMinutes(groomingMinutes + travelMinutes)} accent />
      </div>

      {!isPast && (
        <button
          onClick={onStartTimer}
          className="w-full rounded-2xl bg-gradient-to-r from-rose-300 to-pink-400
                     text-white font-bold text-lg py-4 shadow-lg shadow-rose-200
                     hover:from-rose-400 hover:to-pink-500 active:scale-[0.98]
                     transition-all duration-200"
        >
          준비 타이머 시작 ⏱️
        </button>
      )}

      {isPast && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-center">
          <p className="text-red-400 font-medium text-sm">다음 약속은 꼭 미리 준비해요 💕</p>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-pink-400">{label}</span>
      <span className={`text-sm font-semibold ${accent ? 'text-rose-500' : 'text-rose-700'}`}>
        {value}
      </span>
    </div>
  )
}
