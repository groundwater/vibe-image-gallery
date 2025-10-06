import { GalleryImage } from '../GalleryImage.mts'
import { CHECK, IS_ARRAY, IS_NON_EMPTY, IS_RECORD, IS_STRING } from '../Assertions.mts'
import { GET_RANDOM_ITEM } from '../Random.mts'
import { SourcePresetGroup, SourcePresetGroupBuilder } from '../SourcePreset.mts'

interface MetMuseumImageDetails {
  readonly title: string
  readonly artist: string | undefined
  readonly imageUrl: string
}

export class MetMuseumImageSourcePlugin {
  public readonly type: 'met-museum' = 'met-museum'

  public static Create(search: string): MetMuseumImageSourcePlugin {
    CHECK(IS_NON_EMPTY(search), 'Met search term is required')
    return new MetMuseumImageSourcePlugin(search.trim())
  }

  private constructor(public readonly search: string) {}

  public Describe(): string {
    return `The Met: ${this.search}`
  }

  public async FetchImage(): Promise<GalleryImage> {
    const objectIds = await MetMuseumSearchLoader.Search(this.search)
    CHECK(objectIds.length > 0, 'Met Museum search did not include any objects with images')
    let remaining = objectIds.slice()
    while (remaining.length > 0) {
      const selected = GET_RANDOM_ITEM(remaining)
      remaining = remaining.filter((id) => id !== selected)
      const details = await MetMuseumObjectLoader.Load(selected)
      if (!details) {
        continue
      }
      const label = details.artist && details.artist.length > 0
        ? `${details.title} — ${details.artist} (The Met)`
        : `${details.title} — The Met`
      return GalleryImage.Create({
        url: details.imageUrl,
        label,
        sourceType: 'met-museum'
      })
    }
    throw new Error('Met Museum objects were missing usable images')
  }
}

class MetMuseumSearchLoader {
  public static async Search(query: string): Promise<readonly number[]> {
    const response = await fetch(this.BuildUrl(query), {
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store'
    })
    CHECK(response.ok, `Met Museum search failed with status ${response.status}`)
    const payload: unknown = await response.json()
    return this.Parse(payload)
  }

  private static BuildUrl(query: string): string {
    const encoded = encodeURIComponent(query)
    return `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encoded}`
  }

  private static Parse(payload: unknown): readonly number[] {
    if (!IS_RECORD(payload)) {
      return []
    }
    const idsValue = payload.objectIDs
    if (!IS_ARRAY(idsValue)) {
      return []
    }
    const ids: number[] = []
    for (const value of idsValue) {
      if (typeof value === 'number' && Number.isInteger(value)) {
        ids.push(value)
      }
    }
    return ids
  }
}

class MetMuseumObjectLoader {
  public static async Load(objectId: number): Promise<MetMuseumImageDetails | undefined> {
    const response = await fetch(this.BuildUrl(objectId), {
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store'
    })
    if (!response.ok) {
      return undefined
    }
    const payload: unknown = await response.json()
    return this.Parse(payload)
  }

  private static BuildUrl(objectId: number): string {
    return `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
  }

  private static Parse(payload: unknown): MetMuseumImageDetails | undefined {
    if (!IS_RECORD(payload)) {
      return undefined
    }
    const primaryImage = payload.primaryImage
    const titleValue = payload.title
    if (!IS_STRING(primaryImage) || primaryImage.trim().length === 0) {
      return undefined
    }
    if (!IS_STRING(titleValue) || titleValue.trim().length === 0) {
      return undefined
    }
    let artistValue: string | undefined = undefined
    const artistDisplayName = payload.artistDisplayName
    if (IS_STRING(artistDisplayName) && artistDisplayName.trim().length > 0) {
      artistValue = artistDisplayName.trim()
    }
    return {
      title: titleValue,
      artist: artistValue,
      imageUrl: primaryImage
    }
  }
}

export class MetMuseumSourcePresets {
  public static Groups(): readonly SourcePresetGroup[] {
    return [
      SourcePresetGroupBuilder.Build('Paintings', 'met-museum', [
        'impressionism',
        'portrait',
        'landscape painting'
      ]),
      SourcePresetGroupBuilder.Build('Sculpture & Armor', 'met-museum', [
        'armor',
        'bronze sculpture',
        'classical sculpture'
      ]),
      SourcePresetGroupBuilder.Build('Decorative Arts', 'met-museum', [
        'sunflower',
        'ceramics',
        'textiles'
      ])
    ]
  }
}
