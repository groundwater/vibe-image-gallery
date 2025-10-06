import { GallerySource, GallerySourceFactory, GallerySourceKind } from './GallerySourceFactory.mts'
import { CHECK } from './Assertions.mts'

export interface GallerySourceSnapshot {
  readonly kind: GallerySourceKind
  readonly value: string
}

export class GallerySourceEntry {
  public static Create(source: GallerySource): GallerySourceEntry {
    return new GallerySourceEntry(SourceIdentifier.Next(), source)
  }

  public static FromSnapshot(snapshot: GallerySourceSnapshot): GallerySourceEntry | undefined {
    try {
      const source = GallerySourceFactory.Create(snapshot.kind, snapshot.value)
      return GallerySourceEntry.Create(source)
    } catch {
      return undefined
    }
  }

  private constructor(
    public readonly id: string,
    public readonly source: GallerySource
  ) {
    CHECK(this.id.length > 0, 'Source id must be present')
  }

  public Describe(): string {
    return this.source.Describe()
  }

  public ToSnapshot(): GallerySourceSnapshot {
    switch (this.source.type) {
      case 'reddit':
        return {
          kind: 'reddit',
          value: this.source.subreddit
        }
      case 'unsplash':
        return {
          kind: 'unsplash',
          value: this.source.tag
        }
      case 'flickr':
        return {
          kind: 'flickr',
          value: this.source.tags
        }
      case 'wikimedia-commons':
        return {
          kind: 'wikimedia-commons',
          value: this.source.search
        }
      case 'met-museum':
        return {
          kind: 'met-museum',
          value: this.source.search
        }
      default:
        throw new Error('Unhandled source kind for snapshot')
    }
  }
}

class SourceIdentifier {
  private static counter = 0

  public static Next(): string {
    this.counter += 1
    return `source-${this.counter}`
  }
}
