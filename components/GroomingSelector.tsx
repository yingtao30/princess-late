'use client'

const LEVELS = [
  {
    level: 1,
    emoji: '🌸',
    title: '순수 민낯',
    desc: '기본 케어만',
    time: '10분',
    minutes: 10,
    bg: 'from-pink-50 to-rose-50',
    border: 'border-pink-200',
    selectedBg: 'from-pink-100 to-rose-100',
    selectedBorder: 'border-pink-400',
  },
  {
    level: 2,
    emoji: '💄',
    title: '자연스럽게',
    desc: '간단 메이크업',
    time: '30분',
    minutes: 30,
    bg: 'from-rose-50 to-pink-50',
    border: 'border-rose-200',
    selectedBg: 'from-rose-100 to-pink-100',
    selectedBorder: 'border-rose-400',
  },
  {
    level: 3,
    emoji: '✨',
    title: '요염하게',
    desc: '풀 메이크업',
    time: '1시간',
    minutes: 60,
    bg: 'from-fuchsia-50 to-pink-50',
    border: 'border-fuchsia-200',
    selectedBg: 'from-fuchsia-100 to-pink-100',
    selectedBorder: 'border-fuchsia-400',
  },
  {
    level: 4,
    emoji: '👑',
    title: '완벽한 공주',
    desc: '드레스업 + 헤어',
    time: '1시간 30분',
    minutes: 90,
    bg: 'from-pink-50 to-purple-50',
    border: 'border-pink-300',
    selectedBg: 'from-pink-100 to-purple-100',
    selectedBorder: 'border-pink-500',
  },
]

interface Props {
  selected: number | null
  onSelect: (level: number, minutes: number) => void
}

export default function GroomingSelector({ selected, onSelect }: Props) {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-center text-xl font-bold text-rose-500 mb-1">오늘의 꾸밈 단계는?</h2>
      <p className="text-center text-sm text-pink-400 mb-6">솔직하게 골라야 늦지 않아요 💅</p>

      <div className="grid grid-cols-2 gap-3">
        {LEVELS.map((l) => {
          const isSelected = selected === l.level
          return (
            <button
              key={l.level}
              onClick={() => onSelect(l.level, l.minutes)}
              className={`
                relative rounded-2xl border-2 p-4 text-left transition-all duration-200
                bg-gradient-to-br
                ${isSelected
                  ? `${l.selectedBg} ${l.selectedBorder} shadow-lg scale-[1.03]`
                  : `${l.bg} ${l.border} hover:scale-[1.02] hover:shadow-md`
                }
              `}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 text-xs bg-rose-400 text-white rounded-full px-2 py-0.5 font-medium">
                  선택됨
                </span>
              )}
              <div className="text-3xl mb-2">{l.emoji}</div>
              <div className="font-bold text-rose-700 text-sm">{l.title}</div>
              <div className="text-xs text-rose-400 mt-0.5">{l.desc}</div>
              <div className="mt-2 text-xs font-semibold text-white bg-rose-300 rounded-full px-2 py-0.5 inline-block">
                {l.time}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
