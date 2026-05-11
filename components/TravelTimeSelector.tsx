'use client'

import { useState } from 'react'

const PRESETS = [
  { label: '15분', sub: '도보 🚶‍♀️', minutes: 15 },
  { label: '30분', sub: '지하철 🚇', minutes: 30 },
  { label: '1시간', sub: '버스 🚌', minutes: 60 },
  { label: '1시간 30분', sub: '기차 🚂', minutes: 90 },
]

interface Props {
  selected: number | null
  onSelect: (minutes: number) => void
}

export default function TravelTimeSelector({ selected, onSelect }: Props) {
  const [customMode, setCustomMode] = useState(false)
  const [customVal, setCustomVal] = useState('')

  const isCustomSelected = selected !== null && !PRESETS.find((p) => p.minutes === selected)

  const handleCustomSubmit = () => {
    const n = parseInt(customVal, 10)
    if (!isNaN(n) && n > 0) {
      onSelect(n)
      setCustomMode(false)
    }
  }

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-center text-xl font-bold text-rose-500 mb-1">이동 시간이 얼마나 걸려요?</h2>
      <p className="text-center text-sm text-pink-400 mb-6">대충 맞춰도 괜찮아요 🗺️</p>

      <div className="flex flex-col gap-3">
        {PRESETS.map((p) => {
          const isSelected = selected === p.minutes
          return (
            <button
              key={p.minutes}
              onClick={() => { setCustomMode(false); onSelect(p.minutes) }}
              className={`
                flex items-center justify-between rounded-2xl border-2 px-5 py-3.5
                transition-all duration-200
                ${isSelected
                  ? 'bg-rose-100 border-rose-400 shadow-md scale-[1.02]'
                  : 'bg-white/60 border-pink-200 hover:bg-pink-50 hover:border-pink-300'
                }
              `}
            >
              <span className={`font-bold text-base ${isSelected ? 'text-rose-600' : 'text-rose-400'}`}>
                {p.label}
              </span>
              <span className="text-sm text-pink-300">{p.sub}</span>
              {isSelected && <span className="ml-2 text-rose-400">✓</span>}
            </button>
          )
        })}

        {/* Custom input */}
        <button
          onClick={() => setCustomMode(true)}
          className={`
            flex items-center justify-between rounded-2xl border-2 px-5 py-3.5
            transition-all duration-200
            ${(customMode || isCustomSelected)
              ? 'bg-rose-100 border-rose-400 shadow-md'
              : 'bg-white/60 border-pink-200 hover:bg-pink-50 hover:border-pink-300'
            }
          `}
        >
          <span className={`font-bold text-base ${(customMode || isCustomSelected) ? 'text-rose-600' : 'text-rose-400'}`}>
            직접 입력 ✏️
          </span>
          {isCustomSelected && (
            <span className="text-sm text-rose-500 font-medium">{selected}분</span>
          )}
        </button>

        {customMode && (
          <div className="flex gap-2 animate-fade-in-up">
            <input
              type="number"
              min={1}
              max={300}
              placeholder="분 단위로 입력"
              value={customVal}
              onChange={(e) => setCustomVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
              className="flex-1 rounded-xl border-2 border-pink-200 bg-white/70 px-4 py-2.5 text-rose-600
                         placeholder-pink-200 focus:outline-none focus:border-rose-400 font-medium"
              autoFocus
            />
            <button
              onClick={handleCustomSubmit}
              className="rounded-xl bg-rose-300 hover:bg-rose-400 text-white font-bold px-4 py-2.5
                         transition-colors duration-200"
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
