import { GalleryImage } from './GalleryImage.mts'
import { GallerySourceEntry } from './GallerySourceEntry.mts'
import { CHECK } from './Assertions.mts'
import { GET_RANDOM_ITEM } from './Random.mts'

export class GalleryImagePicker {
  public static async FetchRandom(entries: readonly GallerySourceEntry[]): Promise<GalleryImage> {
    CHECK(entries.length > 0, 'GalleryImagePicker requires at least one source entry')
    const entry = GET_RANDOM_ITEM(entries)
    const candidate = entry.source.FetchImage()
    return candidate
  }
}
