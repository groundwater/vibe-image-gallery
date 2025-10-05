import { GallerySourceEntry, GallerySourceSnapshot } from './GallerySourceEntry.mts'
import { IS_ARRAY, IS_RECORD, IS_STRING } from './Assertions.mts'

export class SourcePersistence {
  private static readonly storageKey = 'vibe-gallery-sources-v1'

  public static Save(entries: readonly GallerySourceEntry[]): void {
    if (!this.HasStorage()) {
      return
    }
    const snapshots = entries.map((entry) => entry.ToSnapshot())
    const payload = JSON.stringify(snapshots)
    window.localStorage.setItem(this.storageKey, payload)
  }

  public static Load(): readonly GallerySourceEntry[] {
    if (!this.HasStorage()) {
      return []
    }
    const raw = window.localStorage.getItem(this.storageKey)
    if (typeof raw !== 'string') {
      return []
    }
    let data: unknown
    try {
      data = JSON.parse(raw)
    } catch {
      return []
    }
    if (!IS_ARRAY(data)) {
      return []
    }
    const entries: GallerySourceEntry[] = []
    for (const item of data) {
      const snapshot = this.ParseSnapshot(item)
      if (!snapshot) {
        continue
      }
      const entry = GallerySourceEntry.FromSnapshot(snapshot)
      if (!entry) {
        continue
      }
      entries.push(entry)
    }
    return entries
  }

  private static ParseSnapshot(payload: unknown): GallerySourceSnapshot | undefined {
    if (!IS_RECORD(payload)) {
      return undefined
    }
    const kindValue = payload.kind
    const valueValue = payload.value
    if (!IS_STRING(kindValue) || !IS_STRING(valueValue)) {
      return undefined
    }
    if (kindValue !== 'reddit' && kindValue !== 'unsplash') {
      return undefined
    }
    return {
      kind: kindValue,
      value: valueValue
    }
  }

  private static HasStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  }
}
