'use client'

function formatDepartureKorean(date: Date): string {
  const h = date.getHours()
  const m = date.getMinutes()
  const ampm = h < 12 ? '오전' : '오후'
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
  const minPart = m === 0 ? '' : ` ${m}분`
  return `${ampm} ${displayH}시${minPart}`
}

interface Props {
  groomingMinutes: number
  appointmentTime: Date
  travelMinutes: number
  departureTime: Date
}

export default function ResultCard({ departureTime }: Props) {
  const isPast = departureTime < new Date()

  return (
    <div className="animate-fade-in-up flex flex-col items-start justify-center h-full" style={{ paddingTop: 40 }}>
      <p className="text-base font-medium mb-3" style={{ color: '#8B95A1' }}>
        {isPast ? '이미 지났어요!' : '공주님,'}
      </p>
      <p
        className="font-black leading-tight"
        style={{ color: isPast ? '#E53935' : '#191F28', fontSize: 36 }}
      >
        {formatDepartureKorean(departureTime)}부터<br />준비하세요
      </p>
    </div>
  )
}
