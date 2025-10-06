import { GalleryImage } from '../GalleryImage.mts'
import { CHECK, IS_ARRAY, IS_NON_EMPTY, IS_RECORD, IS_STRING } from '../Assertions.mts'
import { GET_RANDOM_ITEM } from '../Random.mts'
import { SourcePresetGroup, SourcePresetGroupBuilder } from '../SourcePreset.mts'

interface FlickrFeedEntry {
  readonly title: string
  readonly imageUrl: string
}

export class FlickrImageSourcePlugin {
  public readonly type: 'flickr' = 'flickr'

  public static Create(tags: string): FlickrImageSourcePlugin {
    CHECK(IS_NON_EMPTY(tags), 'Flickr tags are required')
    return new FlickrImageSourcePlugin(tags.trim())
  }

  private constructor(public readonly tags: string) {}

  public Describe(): string {
    return `Flickr: ${this.tags}`
  }

  public async FetchImage(): Promise<GalleryImage> {
    const response = await fetch(this.BuildUrl(), {
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store'
    })
    CHECK(response.ok, `Flickr request failed with status ${response.status}`)
    const payload: unknown = await response.json()
    const entries = FlickrFeedParser.Collect(payload)
    CHECK(entries.length > 0, 'Flickr feed did not include any usable images')
    const selection = GET_RANDOM_ITEM(entries)
    return GalleryImage.Create({
      url: selection.imageUrl,
      label: `${selection.title} — ${this.Describe()}`,
      sourceType: 'flickr'
    })
  }

  private BuildUrl(): string {
    const encodedTags = encodeURIComponent(this.tags)
    return `https://www.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1&tags=${encodedTags}`
  }
}

class FlickrFeedParser {
  public static Collect(payload: unknown): readonly FlickrFeedEntry[] {
    if (!IS_RECORD(payload)) {
      return []
    }
    const items = payload.items
    if (!IS_ARRAY(items)) {
      return []
    }
    const entries: FlickrFeedEntry[] = []
    for (const item of items) {
      if (!IS_RECORD(item)) {
        continue
      }
      const titleValue = item.title
      const mediaRecord = item.media
      if (!IS_STRING(titleValue) || !IS_RECORD(mediaRecord)) {
        continue
      }
      const mediaUrlValue = mediaRecord.m
      if (typeof mediaUrlValue !== 'string') {
        continue
      }
      const upgraded = this.UpgradeResolution(mediaUrlValue)
      entries.push({
        title: titleValue.length > 0 ? titleValue : 'Flickr Image',
        imageUrl: upgraded
      })
    }
    return entries
  }

  private static UpgradeResolution(url: string): string {
    const suffixIndex = url.lastIndexOf('_m.')
    if (suffixIndex === -1) {
      return url
    }
    return `${url.slice(0, suffixIndex)}_b.${url.slice(suffixIndex + 3)}`
  }
}

export class FlickrSourcePresets {
  public static Groups(): readonly SourcePresetGroup[] {
    return [
      SourcePresetGroupBuilder.Build('Landscapes', 'flickr', [
        'landscape',
        'mountain sunrise',
        'desert dusk'
      ]),
      SourcePresetGroupBuilder.Build('City Life', 'flickr', [
        'architecture',
        'cityscape night',
        'urban reflections'
      ]),
      SourcePresetGroupBuilder.Build('Street Moments', 'flickr', [
        'street photography',
        'documentary street',
        'black and white street'
      ]),
      SourcePresetGroupBuilder.Build('Wildlife', 'flickr', [
        'wildlife',
        'birds in flight',
        'macro insects'
      ])
    ]
  }
}
