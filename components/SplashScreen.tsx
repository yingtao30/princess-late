'use client'

import { track } from '@/lib/mixpanel'

export default function SplashScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="h-full relative overflow-hidden">
      {/* Background image — full cover */}
      <img
        src="/splash2.png"
        alt="공주는 지각쟁이"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
        }}
      />

      {/* Button — fixed to bottom */}
      <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: 98, zIndex: 10 }}>
        <button
          onClick={() => { track('splash_cta_clicked'); onStart() }}
          className="text-white transition-all active:scale-[0.98] active:opacity-80"
          style={{
            width: 340,
            height: 71,
            borderRadius: 7,
            background: '#101010',
            fontSize: 16,
            fontFamily: "'Nanum Gothic', sans-serif",
            fontWeight: 400,
            letterSpacing: '0.04em',
          }}
        >
          준비 시간 설정하기
        </button>
      </div>
    </div>
  )
}
