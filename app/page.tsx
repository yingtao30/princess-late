'use client'

import { useState } from 'react'
import SplashScreen from '@/components/SplashScreen'
import GroomingSelector from '@/components/GroomingSelector'
import DrumRollPicker from '@/components/DrumRollPicker'
import TravelTimeSelector from '@/components/TravelTimeSelector'
import ResultCard from '@/components/ResultCard'

type Step = 'splash' | 'grooming' | 'time' | 'travel' | 'result'

const STEP_ORDER: Step[] = ['splash', 'grooming', 'time', 'travel', 'result']

function getDefaultTime() {
  const d = new Date()
  d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5 + 120, 0, 0)
  if (d.getMinutes() >= 60) {
    d.setHours(d.getHours() + 1)
    d.setMinutes(d.getMinutes() - 60)
  }
  return { hour: d.getHours(), minute: d.getMinutes() }
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

  function goBack() {
    if (currentStepIdx > 1) setStep(STEP_ORDER[currentStepIdx - 1])
  }

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

  const showBackBtn = currentStepIdx > 1

  if (step === 'splash') {
    return <SplashScreen onStart={() => setStep('grooming')} />
  }

  return (
    <main className="min-h-full flex flex-col" style={{ backgroundImage: "url('/bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>

      {/* Step progress bar */}
      <div className="w-full px-[26px]" style={{ paddingTop: 20 }}>
        <div className="w-full flex gap-1.5" style={{ height: 6 }}>
          {(['grooming', 'time', 'travel', 'result'] as Step[]).map((s, i) => {
            const active = STEP_ORDER.indexOf(step) >= i + 1
            return (
              <div
                key={s}
                className="flex-1 rounded-full transition-all duration-300"
                style={{ background: active ? '#101010' : '#F2F4F6' }}
              />
            )
          })}
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto pb-12 flex flex-col gap-6 flex-1" style={{ paddingLeft: 26, paddingRight: 26, paddingTop: 80 }}>

        <div className="flex-1">
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

              <button
                onClick={() => setStep('travel')}
                className="w-full mt-4 rounded-2xl text-white font-bold text-lg py-4 active:scale-[0.98] transition-all duration-200"
                style={{ background: '#191F28' }}
              >
                다음 →
              </button>
            </div>
          )}

          {step === 'travel' && (
            <TravelTimeSelector
              selected={travelMinutes}
              onSelect={(m) => {
                setTravelMinutes(m)
                setStep('result')
              }}
            />
          )}

          {step === 'result' && travelMinutes !== null && (
            <ResultCard
              groomingMinutes={groomingMinutes}
              appointmentTime={getAppointmentDate()}
              travelMinutes={travelMinutes}
              departureTime={getDepartureTime()}
            />
          )}
        </div>

        {showBackBtn && (
          <button
            onClick={goBack}
            className="self-start flex items-center gap-1 text-sm font-medium transition-colors duration-200"
            style={{ color: '#8B95A1' }}
          >
            ← 뒤로가기
          </button>
        )}
      </div>
    </main>
  )
}
