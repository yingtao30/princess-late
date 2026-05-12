'use client'

import { useState } from 'react'

const PRESETS = [
  { label: '15분', sub: '도보', minutes: 15 },
  { label: '30분', sub: '지하철', minutes: 30 },
  { label: '1시간', sub: '버스', minutes: 60 },
  { label: '1시간 30분', sub: '기차', minutes: 90 },
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
      <h2 className="text-xl font-bold mb-6" style={{ color: '#191F28' }}>이동 시간이 얼마나 걸려요?</h2>

      <div className="flex flex-col gap-3">
        {PRESETS.map((p) => {
          const isSelected = selected === p.minutes
          return (
            <button
              key={p.minutes}
              onClick={() => { setCustomMode(false); onSelect(p.minutes) }}
              className={`
                flex items-center justify-between rounded-2xl border-2 px-5 py-4
                transition-all duration-200
                ${isSelected
                  ? 'bg-rose-50 border-rose-400 shadow-md scale-[1.02]'
                  : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-sm'
                }
              `}
            >
              <p className="font-bold text-base" style={{ color: '#191F28' }}>{p.label}</p>
              <p className="text-sm" style={{ color: '#8B95A1' }}>{p.sub}</p>
            </button>
          )
        })}

        <button
          onClick={() => setCustomMode(true)}
          className={`
            flex items-center justify-between rounded-2xl border-2 px-5 py-4
            transition-all duration-200
            ${(customMode || isCustomSelected)
              ? 'bg-rose-50 border-rose-400 shadow-md'
              : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-sm'
            }
          `}
        >
          <p className="font-bold text-base" style={{ color: '#191F28' }}>직접 입력</p>
          {isCustomSelected && (
            <p className="text-sm font-medium" style={{ color: '#6B7684' }}>{selected}분</p>
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
              className="flex-1 rounded-xl border-2 border-stone-200 bg-white px-4 py-2.5
                         focus:outline-none focus:border-rose-400 font-medium"
              style={{ color: '#191F28' }}
              autoFocus
            />
            <button
              onClick={handleCustomSubmit}
              className="rounded-xl text-white font-bold px-4 py-2.5 transition-colors duration-200"
              style={{ background: '#f43f5e' }}
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
