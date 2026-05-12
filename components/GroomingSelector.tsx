'use client'

const LEVELS = [
  { level: 1, title: '1단계', desc: '기본 케어만', time: '10분', minutes: 10 },
  { level: 2, title: '2단계', desc: '간단 메이크업', time: '30분', minutes: 30 },
  { level: 3, title: '3단계', desc: '풀 메이크업', time: '1시간', minutes: 60 },
  { level: 4, title: '4단계', desc: '드레스업 + 헤어', time: '1시간 30분', minutes: 90 },
]

interface Props {
  selected: number | null
  onSelect: (level: number, minutes: number) => void
}

export default function GroomingSelector({ selected, onSelect }: Props) {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-xl font-bold mb-6" style={{ color: '#191F28' }}>오늘 꾸밈 단계는?</h2>

      <div className="flex flex-col gap-3">
        {LEVELS.map((l) => {
          const isSelected = selected === l.level
          return (
            <button
              key={l.level}
              onClick={() => onSelect(l.level, l.minutes)}
              className={`
                flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left
                transition-all duration-200
                ${isSelected
                  ? 'bg-rose-50 border-rose-400 shadow-md scale-[1.02]'
                  : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-sm'
                }
              `}
            >
              <div>
                <p className="font-bold text-base" style={{ color: '#191F28' }}>
                  {l.title}
                </p>
                <p className="text-sm mt-0.5" style={{ color: '#8B95A1' }}>{l.desc}</p>
              </div>
              <span
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={isSelected
                  ? { background: '#f43f5e', color: '#ffffff' }
                  : { background: '#F2F4F6', color: '#6B7684' }
                }
              >
                {l.time}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
