import { GalleryImage } from '../GalleryImage.mts'
import { CHECK, IS_ARRAY, IS_NON_EMPTY, IS_RECORD, IS_STRING } from '../Assertions.mts'
import { GET_RANDOM_ITEM } from '../Random.mts'

interface WikimediaImageEntry {
  readonly title: string
  readonly imageUrl: string
}

export class WikimediaCommonsImageSourcePlugin {
  public readonly type: 'wikimedia-commons' = 'wikimedia-commons'

  public static Create(search: string): WikimediaCommonsImageSourcePlugin {
    CHECK(IS_NON_EMPTY(search), 'Wikimedia search term is required')
    return new WikimediaCommonsImageSourcePlugin(search.trim())
  }

  private constructor(public readonly search: string) {}

  public Describe(): string {
    return `Wikimedia Commons: ${this.search}`
  }

  public async FetchImage(): Promise<GalleryImage> {
    const response = await fetch(this.BuildUrl(), {
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store'
    })
    CHECK(response.ok, `Wikimedia request failed with status ${response.status}`)
    const payload: unknown = await response.json()
    const entries = WikimediaCommonsParser.Collect(payload)
    CHECK(entries.length > 0, 'Wikimedia search did not include any usable images')
    const selection = GET_RANDOM_ITEM(entries)
    return GalleryImage.Create({
      url: selection.imageUrl,
      label: `${selection.title} — Wikimedia Commons`,
      sourceType: 'wikimedia-commons'
    })
  }

  private BuildUrl(): string {
    const query = encodeURIComponent(this.search)
    return `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${query}&gsrlimit=50&gsrnamespace=6&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1920&iiurlheight=1080`
  }
}

class WikimediaCommonsParser {
  public static Collect(payload: unknown): readonly WikimediaImageEntry[] {
    if (!IS_RECORD(payload)) {
      return []
    }
    const query = payload.query
    if (!IS_RECORD(query)) {
      return []
    }
    const pages = query.pages
    if (!IS_RECORD(pages)) {
      return []
    }
    const entries: WikimediaImageEntry[] = []
    for (const value of Object.values(pages)) {
      if (!IS_RECORD(value)) {
        continue
      }
      const titleValue = value.title
      if (!IS_STRING(titleValue)) {
        continue
      }
      const imageInfoValue = value.imageinfo
      if (!IS_ARRAY(imageInfoValue) || imageInfoValue.length === 0) {
        continue
      }
      const imageRecord = imageInfoValue[0]
      if (!IS_RECORD(imageRecord)) {
        continue
      }
      const urlValue = imageRecord.url
      if (typeof urlValue !== 'string') {
        continue
      }
      entries.push({
        title: titleValue,
        imageUrl: urlValue
      })
    }
    return entries
  }
}
