'use client'

import { useRef, useEffect, useCallback } from 'react'

const ITEM_H = 44
const VISIBLE = 5
const PAD = ITEM_H * Math.floor(VISIBLE / 2)

interface ColumnProps {
  items: string[]
  selectedIndex: number
  onSelect: (i: number) => void
  width?: number
}

function Column({ items, selectedIndex, onSelect, width = 64 }: ColumnProps) {
  const ref = useRef<HTMLDivElement>(null)
  const scrolling = useRef(false)

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

  return (
    <div className="relative" style={{ width, height: ITEM_H * VISIBLE }}>
      <div
        className="absolute inset-x-0 top-0 pointer-events-none z-10"
        style={{ height: PAD, background: 'linear-gradient(to bottom, #ffffff 0%, transparent 100%)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
        style={{ height: PAD, background: 'linear-gradient(to top, #ffffff 0%, transparent 100%)' }}
      />
      <div
        className="absolute inset-x-1 rounded-xl pointer-events-none z-0"
        style={{ top: PAD, height: ITEM_H, background: '#F2F4F6' }}
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
                className="transition-all duration-150"
                style={{
                  fontSize: dist === 0 ? 20 : dist === 1 ? 16 : 13,
                  color: dist === 0 ? '#191F28' : dist === 1 ? '#8B95A1' : '#D1D6DB',
                  fontWeight: dist === 0 ? 700 : 400,
                  fontFamily: "'Nanum Gothic', sans-serif",
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

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))
const AMPM = ['오전', '오후']

interface Props {
  hour: number      // 0-23
  minute: number    // 0, 5, 10, ..., 55
  onHourChange: (h: number) => void
  onMinuteChange: (m: number) => void
}

export default function DrumRollPicker({ hour, minute, onHourChange, onMinuteChange }: Props) {
  const ampmIndex = hour >= 12 ? 1 : 0
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const hourIndex = displayHour - 1  // 0-11

  const handleHourSelect = (i: number) => {
    const h12 = i + 1
    const h24 = ampmIndex === 0
      ? (h12 === 12 ? 0 : h12)
      : (h12 === 12 ? 12 : h12 + 12)
    onHourChange(h24)
  }

  const handleAmpmSelect = (i: number) => {
    const h12 = hourIndex + 1
    const h24 = i === 0
      ? (h12 === 12 ? 0 : h12)
      : (h12 === 12 ? 12 : h12 + 12)
    onHourChange(h24)
  }

  return (
    <div className="flex items-center justify-center gap-1 py-2">
      <Column items={AMPM}     selectedIndex={ampmIndex}              onSelect={handleAmpmSelect} width={72} />
      <Divider />
      <Column items={HOURS_12} selectedIndex={hourIndex}              onSelect={handleHourSelect} width={64} />
      <Divider />
      <Column items={MINUTES}  selectedIndex={Math.round(minute / 5)} onSelect={(i) => onMinuteChange(i * 5)} width={64} />
    </div>
  )
}

function Divider() {
  return (
    <span className="text-2xl font-bold select-none" style={{ color: '#D1D6DB', marginBottom: 4 }}>:</span>
  )
}
