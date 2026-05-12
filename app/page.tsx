'use client'

import { useState, useEffect } from 'react'
import { track } from '@/lib/mixpanel'
import SplashScreen from '@/components/SplashScreen'
import GroomingSelector from '@/components/GroomingSelector'
import DrumRollPicker from '@/components/DrumRollPicker'
import TravelTimeSelector from '@/components/TravelTimeSelector'
import ResultCard from '@/components/ResultCard'

type Step = 'splash' | 'grooming' | 'time' | 'travel' | 'result'

const STEP_ORDER: Step[] = ['splash', 'grooming', 'time', 'travel', 'result']
const PROGRESS_STEPS: Step[] = ['grooming', 'time', 'travel', 'result']

const CTA_STYLE: React.CSSProperties = {
  width: 340,
  height: 66,
  borderRadius: 7,
  background: '#101010',
  color: '#ffffff',
  fontSize: 16,
  fontWeight: 400,
  fontFamily: "'Nanum Gothic', sans-serif",
  letterSpacing: '0.04em',
  flexShrink: 0,
}

function getDefaultTime() {
  const d = new Date()
  d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5 + 120, 0, 0)
  if (d.getMinutes() >= 60) {
    d.setHours(d.getHours() + 1)
    d.setMinutes(d.getMinutes() - 60)
  }
  return { hour: d.getHours(), minute: d.getMinutes() }
}

function ResultStep({
  groomingLevel, groomingMinutes, appointmentTime, travelMinutes, departureTime,
}: {
  groomingLevel: number | null
  groomingMinutes: number
  appointmentTime: Date
  travelMinutes: number
  departureTime: Date
}) {
  useEffect(() => {
    track('result_viewed', {
      grooming_level: groomingLevel,
      grooming_minutes: groomingMinutes,
      travel_minutes: travelMinutes,
    })
  }, [])

  return (
    <ResultCard
      groomingMinutes={groomingMinutes}
      appointmentTime={appointmentTime}
      travelMinutes={travelMinutes}
      departureTime={departureTime}
    />
  )
}

export default function Home() {
  const [step, setStep] = useState<Step>('splash')
  const [groomingLevel, setGroomingLevel] = useState<number | null>(null)
  const [groomingMinutes, setGroomingMinutes] = useState(30)

  const defaultTime = getDefaultTime()
  const [apptHour, setApptHour] = useState(defaultTime.hour)
  const [apptMinute, setApptMinute] = useState(defaultTime.minute)
  const [travelMinutes, setTravelMinutes] = useState<number | null>(null)

  const currentStepIdx = STEP_ORDER.indexOf(step)

  function getAppointmentDate(): Date {
    const d = new Date()
    d.setHours(apptHour, apptMinute, 0, 0)
    if (d.getTime() < Date.now() - 2 * 60 * 60 * 1000) {
      d.setDate(d.getDate() + 1)
    }
    return d
  }

  function getDepartureTime(): Date {
    const appt = getAppointmentDate()
    return new Date(appt.getTime() - ((travelMinutes ?? 0) + groomingMinutes) * 60 * 1000)
  }

  function handleProgressClick(s: Step) {
    const targetIdx = STEP_ORDER.indexOf(s)
    if (targetIdx <= currentStepIdx && targetIdx >= 1) {
      if (s === 'grooming') {
        track('session_restarted')
        setGroomingLevel(null)
        setTravelMinutes(null)
      }
      setStep(s)
    }
  }

  if (step === 'splash') {
    return <SplashScreen onStart={() => setStep('grooming')} />
  }

  // CTA config per step
  const cta: { label: string; onClick: () => void; disabled?: boolean } | null =
    step === 'time' ? { label: '다음', onClick: () => setStep('travel') }
    : step === 'travel' ? { label: '출발 시간 보기', onClick: () => setStep('result'), disabled: travelMinutes === null }
    : step === 'result' ? { label: '새로 설정하기', onClick: () => { track('session_restarted'); setStep('grooming'); setGroomingLevel(null); setTravelMinutes(null) } }
    : null

  return (
    <main
      className="min-h-full flex flex-col relative"
      style={{ backgroundImage: "url('/bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Step progress bar */}
      <div className="w-full px-[26px]" style={{ paddingTop: 20 }}>
        <div className="w-full flex gap-1.5" style={{ height: 6 }}>
          {PROGRESS_STEPS.map((s, i) => {
            const active = STEP_ORDER.indexOf(step) >= i + 1
            const clickable = active
            return (
              <div
                key={s}
                className="flex-1 rounded-full transition-all duration-300"
                style={{ background: active ? '#101010' : '#F2F4F6', cursor: clickable ? 'pointer' : 'default' }}
                onClick={() => clickable && handleProgressClick(s)}
              />
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div
        className="w-full max-w-sm mx-auto flex-1"
        style={{ paddingLeft: 26, paddingRight: 26, paddingTop: 80, paddingBottom: cta ? 180 : 40 }}
      >
        {step === 'grooming' && (
          <GroomingSelector
            selected={groomingLevel}
            onSelect={(level, mins) => {
              setGroomingLevel(level)
              setGroomingMinutes(mins)
              setStep('time')
            }}
          />
        )}

        {step === 'time' && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold mb-6" style={{ color: '#191F28' }}>약속 시간이 언제예요?</h2>
            <div className="rounded-3xl bg-white border border-stone-100 shadow-sm p-6">
              <DrumRollPicker
                hour={apptHour}
                minute={apptMinute}
                onHourChange={setApptHour}
                onMinuteChange={setApptMinute}
              />
            </div>
          </div>
        )}

        {step === 'travel' && (
          <TravelTimeSelector
            selected={travelMinutes}
            onSelect={setTravelMinutes}
          />
        )}

        {step === 'result' && travelMinutes !== null && (
          <ResultStep
            groomingLevel={groomingLevel}
            groomingMinutes={groomingMinutes}
            appointmentTime={getAppointmentDate()}
            travelMinutes={travelMinutes}
            departureTime={getDepartureTime()}
          />
        )}
      </div>

      {/* Bottom CTA button — fixed to bottom, same style as splash */}
      {cta && (
        <div
          className="absolute left-0 right-0 flex justify-center"
          style={{ bottom: 98 }}
        >
          <button
            onClick={cta.onClick}
            disabled={cta.disabled}
            className="transition-all active:scale-[0.98] active:opacity-80"
            style={{
              ...CTA_STYLE,
              background: cta.disabled ? '#D1D6DB' : '#101010',
            }}
          >
            {cta.label}
          </button>
        </div>
      )}
    </main>
  )
}
