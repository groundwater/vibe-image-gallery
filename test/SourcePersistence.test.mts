import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { SourcePersistence } from '../src/lib/SourcePersistence.mts'
import { GallerySourceFactory } from '../src/lib/GallerySourceFactory.mts'
import { GallerySourceEntry } from '../src/lib/GallerySourceEntry.mts'

class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>()

  public get length(): number {
    return this.store.size
  }

  public clear(): void {
    this.store.clear()
  }

  public getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null
  }

  public key(index: number): string | null {
    const keys = Array.from(this.store.keys())
    return keys[index] ?? null
  }

  public removeItem(key: string): void {
    this.store.delete(key)
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, value)
  }
}

test('source persistence saves and loads gallery sources', () => {
  const originalWindow = (globalThis as { window?: Window }).window
  const storage = new MemoryStorage()
  const mockWindow = { localStorage: storage } as unknown as Window
  ;(globalThis as { window?: Window }).window = mockWindow

  try {
    const unsplash = GallerySourceFactory.Create('unsplash', 'mountains')
    const unsplashEntry = GallerySourceEntry.Create(unsplash)

    SourcePersistence.Save([unsplashEntry])
    const restored = SourcePersistence.Load()

    assert.equal(restored.length, 1)
    const [restoredEntry] = restored
    if (!restoredEntry) {
      throw new Error('Expected a restored entry')
    }
    assert.equal(restoredEntry.Describe(), unsplashEntry.Describe())

    storage.setItem('vibe-gallery-sources-v1', 'not json')
    assert.equal(SourcePersistence.Load().length, 0)
  } finally {
    if (originalWindow) {
      ;(globalThis as { window?: Window }).window = originalWindow
    } else {
      Reflect.deleteProperty(globalThis, 'window')
    }
  }
})
