'use client'

import { useRef, useEffect, useCallback } from 'react'

const ITEM_H = 44
const VISIBLE = 5
const PAD = ITEM_H * Math.floor(VISIBLE / 2) // 88

interface ColumnProps {
  items: string[]
  selectedIndex: number
  onSelect: (i: number) => void
  width?: string
}

function Column({ items, selectedIndex, onSelect, width = 'w-16' }: ColumnProps) {
  const ref = useRef<HTMLDivElement>(null)
  const scrolling = useRef(false)

  // Scroll to selected on mount and external change
  useEffect(() => {
    if (ref.current && !scrolling.current) {
      ref.current.scrollTop = selectedIndex * ITEM_H
    }
  }, [selectedIndex])

  const handleScroll = useCallback(() => {
    if (!ref.current) return
    const idx = Math.round(ref.current.scrollTop / ITEM_H)
    const clamped = Math.max(0, Math.min(idx, items.length - 1))
    if (clamped !== selectedIndex) onSelect(clamped)
  }, [items.length, selectedIndex, onSelect])

  const scrollTo = (i: number) => {
    if (ref.current) {
      scrolling.current = true
      ref.current.scrollTo({ top: i * ITEM_H, behavior: 'smooth' })
      setTimeout(() => { scrolling.current = false }, 400)
    }
    onSelect(i)
  }

  const containerH = ITEM_H * VISIBLE

  return (
    <div className={`relative ${width}`} style={{ height: containerH }}>
      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none z-10"
        style={{
          height: PAD,
          background: 'linear-gradient(to bottom, #fff0f5 0%, transparent 100%)',
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
        style={{
          height: PAD,
          background: 'linear-gradient(to top, #fff0f5 0%, transparent 100%)',
        }}
      />
      {/* Center highlight */}
      <div
        className="absolute inset-x-1 rounded-xl bg-rose-100/70 border border-rose-200 pointer-events-none z-0"
        style={{ top: PAD, height: ITEM_H }}
      />

      <div
        ref={ref}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide relative z-[5]"
        style={{ paddingTop: PAD, paddingBottom: PAD }}
        onScroll={handleScroll}
      >
        {items.map((item, i) => {
          const dist = Math.abs(i - selectedIndex)
          return (
            <div
              key={i}
              className="snap-center flex items-center justify-center cursor-pointer select-none"
              style={{ height: ITEM_H }}
              onClick={() => scrollTo(i)}
            >
              <span
                className="transition-all duration-150 font-medium"
                style={{
                  fontSize: dist === 0 ? 22 : dist === 1 ? 17 : 13,
                  color: dist === 0 ? '#e11d6a' : dist === 1 ? '#f9a8c4' : '#fce7f3',
                  fontWeight: dist === 0 ? 700 : 400,
                }}
              >
                {item}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

interface Props {
  hour: number
  minute: number // actual minute (0,5,10,...,55)
  onHourChange: (h: number) => void
  onMinuteChange: (m: number) => void
}

export default function DrumRollPicker({ hour, minute, onHourChange, onMinuteChange }: Props) {
  const minuteIndex = Math.round(minute / 5)

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <Column
        items={HOURS}
        selectedIndex={hour}
        onSelect={onHourChange}
        width="w-16"
      />
      <span className="text-rose-400 text-3xl font-bold mb-1 select-none">:</span>
      <Column
        items={MINUTES}
        selectedIndex={minuteIndex}
        onSelect={(i) => onMinuteChange(i * 5)}
        width="w-16"
      />
      <span className="text-rose-400 text-sm font-medium self-end mb-3 ml-1">오전/오후</span>
    </div>
  )
}
