'use client'

import { useState } from 'react'
import GroomingSelector from '@/components/GroomingSelector'
import DrumRollPicker from '@/components/DrumRollPicker'
import TravelTimeSelector from '@/components/TravelTimeSelector'
import ResultCard from '@/components/ResultCard'
import PrepTimer from '@/components/PrepTimer'

type Step = 'grooming' | 'time' | 'travel' | 'result' | 'timer'

const STEP_ORDER: Step[] = ['grooming', 'time', 'travel', 'result', 'timer']

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
  const [step, setStep] = useState<Step>('grooming')
  const [groomingLevel, setGroomingLevel] = useState<number | null>(null)
  const [groomingMinutes, setGroomingMinutes] = useState(30)

  const defaultTime = getDefaultTime()
  const [apptHour, setApptHour] = useState(defaultTime.hour)
  const [apptMinute, setApptMinute] = useState(defaultTime.minute)

  const [travelMinutes, setTravelMinutes] = useState<number | null>(null)

  const currentStepIdx = STEP_ORDER.indexOf(step)

  function goBack() {
    if (currentStepIdx > 0) setStep(STEP_ORDER[currentStepIdx - 1])
  }

  function getAppointmentDate(): Date {
    const d = new Date()
    d.setHours(apptHour, apptMinute, 0, 0)
    // If the appointment time seems to be in the past (>2h ago), assume tomorrow
    if (d.getTime() < Date.now() - 2 * 60 * 60 * 1000) {
      d.setDate(d.getDate() + 1)
    }
    return d
  }

  function getDepartureTime(): Date {
    const appt = getAppointmentDate()
    return new Date(appt.getTime() - ((travelMinutes ?? 0) + groomingMinutes) * 60 * 1000)
  }

  const showBackBtn = currentStepIdx > 0 && step !== 'timer'

  return (
    <main className="min-h-svh flex flex-col">
      <div className="w-full max-w-sm mx-auto px-4 pt-10 pb-12 flex flex-col gap-6 flex-1">

        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-2 select-none">👸</div>
          <h1 className="text-2xl font-black text-rose-500 tracking-tight">공주는 지각쟁이</h1>
          <p className="text-xs text-pink-300 mt-1">오늘도 제때 도착해볼까요?</p>
        </div>

        {/* Step indicator (not on timer) */}
        {step !== 'timer' && (
          <div className="flex items-center justify-center gap-1.5">
            {(['grooming', 'time', 'travel', 'result'] as Step[]).map((s, i) => {
              const active = STEP_ORDER.indexOf(step) >= i
              return (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    active ? 'bg-rose-300 w-8' : 'bg-pink-100 w-2'
                  }`}
                />
              )
            })}
          </div>
        )}

        {/* Content area */}
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
              <h2 className="text-center text-xl font-bold text-rose-500 mb-1">약속 시간이 언제예요?</h2>
              <p className="text-center text-sm text-pink-400 mb-4">스크롤해서 시간을 맞춰요 🕐</p>

              <div className="rounded-3xl bg-white/60 backdrop-blur border border-pink-100 shadow-sm p-6">
                <DrumRollPicker
                  hour={apptHour}
                  minute={apptMinute}
                  onHourChange={setApptHour}
                  onMinuteChange={setApptMinute}
                />

                <div className="text-center mt-4 text-sm text-pink-400">
                  선택된 시간:{' '}
                  <span className="font-bold text-rose-500 text-base">
                    {apptHour < 12 ? '오전' : '오후'}{' '}
                    {apptHour === 0 ? 12 : apptHour > 12 ? apptHour - 12 : apptHour}:
                    {String(apptMinute).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStep('travel')}
                className="w-full mt-4 rounded-2xl bg-gradient-to-r from-rose-300 to-pink-400
                           text-white font-bold text-lg py-4 shadow-lg shadow-rose-100
                           hover:from-rose-400 hover:to-pink-500 active:scale-[0.98] transition-all duration-200"
              >
                다음 →
              </button>
            </div>
          )}

          {step === 'travel' && (
            <div>
              <TravelTimeSelector
                selected={travelMinutes}
                onSelect={(m) => {
                  setTravelMinutes(m)
                  setStep('result')
                }}
              />
            </div>
          )}

          {step === 'result' && travelMinutes !== null && groomingLevel !== null && (
            <ResultCard
              groomingLevel={groomingLevel}
              groomingMinutes={groomingMinutes}
              appointmentTime={getAppointmentDate()}
              travelMinutes={travelMinutes}
              departureTime={getDepartureTime()}
              onStartTimer={() => setStep('timer')}
            />
          )}

          {step === 'timer' && travelMinutes !== null && (
            <div>
              <div className="text-center mb-4">
                <p className="text-xl font-black text-rose-500">준비 타이머 ⏱️</p>
                <p className="text-xs text-pink-400 mt-1">3분 전에 알림을 보내드릴게요</p>
              </div>
              <PrepTimer
                departureTime={getDepartureTime()}
                groomingMinutes={groomingMinutes}
                travelMinutes={travelMinutes ?? 0}
                onBack={() => setStep('result')}
              />
            </div>
          )}
        </div>

        {/* Back button */}
        {showBackBtn && (
          <button
            onClick={goBack}
            className="self-start flex items-center gap-1 text-pink-400 hover:text-rose-400
                       text-sm font-medium transition-colors duration-200"
          >
            ← 뒤로가기
          </button>
        )}
      </div>
    </main>
  )
}
