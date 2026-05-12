import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '공주는 지각쟁이 👸',
  description: '오늘도 제때 도착해볼까요?',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="phone-frame">{children}</div>
      </body>
    </html>
  )
}
