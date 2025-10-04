import { GallerySource } from './GallerySourceFactory.mts'
import { CHECK } from './Assertions.mts'

export class GallerySourceEntry {
  public static Create(source: GallerySource): GallerySourceEntry {
    return new GallerySourceEntry(SourceIdentifier.Next(), source)
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
}

class SourceIdentifier {
  private static counter = 0

  public static Next(): string {
    this.counter += 1
    return `source-${this.counter}`
  }
}
