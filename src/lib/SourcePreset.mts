import { GallerySourceKind } from './GallerySourceFactory.mts'
import { CHECK, IS_NON_EMPTY } from './Assertions.mts'

export interface SourcePresetEntry {
  readonly kind: GallerySourceKind
  readonly value: string
}

export interface SourcePresetGroup {
  readonly label: string
  readonly entries: readonly SourcePresetEntry[]
}

export class SourcePresetGroupBuilder {
  public static Build(label: string, kind: GallerySourceKind, values: readonly string[]): SourcePresetGroup {
    const trimmedLabel = label.trim()
    CHECK(IS_NON_EMPTY(trimmedLabel), 'Preset group label is required')
    const unique = new Map<string, SourcePresetEntry>()
    for (const value of values) {
      const trimmedValue = value.trim()
      if (!IS_NON_EMPTY(trimmedValue)) {
        continue
      }
      const normalized = trimmedValue.toLowerCase()
      if (unique.has(normalized)) {
        continue
      }
      unique.set(normalized, {
        kind,
        value: trimmedValue
      })
    }
    const entries = Array.from(unique.values())
    CHECK(entries.length > 0, `Preset group ${trimmedLabel} does not include any entries`)
    return {
      label: trimmedLabel,
      entries
    }
  }
}
