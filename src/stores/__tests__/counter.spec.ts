import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '../counter'

describe('useCounterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts at zero', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
    expect(store.doubleCount).toBe(0)
  })

  it('increments count and keeps doubleCount in sync', () => {
    const store = useCounterStore()
    store.increment()
    store.increment()
    expect(store.count).toBe(2)
    expect(store.doubleCount).toBe(4)
  })

  it('resets count to zero', () => {
    const store = useCounterStore()
    store.increment()
    store.reset()
    expect(store.count).toBe(0)
  })
})
