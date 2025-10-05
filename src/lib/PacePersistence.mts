import { CHECK } from './Assertions.mts'

export class PacePersistence {
  private static readonly storageKey = 'vibe-gallery-pace-v1'

  public static Save(paceMs: number): void {
    CHECK(Number.isFinite(paceMs) && paceMs > 0, 'Pace must be positive and finite')
    if (!this.HasStorage()) {
      return
    }
    window.localStorage.setItem(this.storageKey, String(paceMs))
  }

  public static Load(defaultValue: number): number {
    if (!this.HasStorage()) {
      return defaultValue
    }
    const raw = window.localStorage.getItem(this.storageKey)
    if (raw === null) {
      return defaultValue
    }
    const parsed = Number.parseInt(raw, 10)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return defaultValue
    }
    return parsed
  }

  private static HasStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  }
}
