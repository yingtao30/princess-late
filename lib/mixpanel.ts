import mixpanel from 'mixpanel-browser'

const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? ''

let initialized = false

function init() {
  if (initialized || !token || token === 'your_token_here') return
  mixpanel.init(token, { track_pageview: false, persistence: 'localStorage' })
  initialized = true
}

export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  init()
  if (!initialized) return
  mixpanel.track(event, props)
}
