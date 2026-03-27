import plugin from './plugin'

type EventHandler = (payload: unknown) => void

const bus = new Map<string, Set<EventHandler>>()

const mockContext = {
  storage: {
    async get<T>(key: string): Promise<T | null> {
      const raw = window.localStorage.getItem(`davinvi:${key}`)
      if (!raw) {
        return null
      }

      try {
        return JSON.parse(raw) as T
      } catch {
        return null
      }
    },
    async save<T>(key: string, data: T): Promise<void> {
      window.localStorage.setItem(`davinvi:${key}`, JSON.stringify(data))
    },
  },
  eventBus: {
    emit(event: string, payload: unknown): void {
      const handlers = bus.get(event)
      if (!handlers) {
        return
      }

      for (const handler of handlers) {
        handler(payload)
      }
    },
    on(event: string, callback: EventHandler): void {
      if (!bus.has(event)) {
        bus.set(event, new Set())
      }

      bus.get(event)?.add(callback)
    },
    off(event: string, callback: EventHandler): void {
      bus.get(event)?.delete(callback)
    },
  },
  theme: 'light' as const,
  runtimeConfig: {
    mode: 'local-dev',
  },
}

const hostRoot = document.getElementById('root')

if (!hostRoot) {
  throw new Error('Host root container #root not found')
}

void plugin.mount(hostRoot, mockContext)

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    void plugin.unmount(hostRoot)
  })
}
