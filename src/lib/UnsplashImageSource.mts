import { GalleryImage } from './GalleryImage.mts'
import { CHECK, IS_NON_EMPTY } from './Assertions.mts'

export class UnsplashImageSource {
  public readonly type: 'unsplash' = 'unsplash'

  public static Create(tag: string): UnsplashImageSource {
    CHECK(IS_NON_EMPTY(tag), 'Unsplash tag is required')
    return new UnsplashImageSource(tag.trim())
  }

  private constructor(public readonly tag: string) {}

  public Describe(): string {
    return `Unsplash: ${this.tag}`
  }

  public async FetchImage(): Promise<GalleryImage> {
    const url = this.BuildUrl()
    return GalleryImage.Create({
      url,
      label: `Unsplash — ${this.tag}`,
      sourceType: 'unsplash'
    })
  }

  private BuildUrl(): string {
    const encodedTag = encodeURIComponent(this.tag)
    const seed = Date.now().toString()
    return `https://source.unsplash.com/random/1600x900/?${encodedTag}&sig=${seed}`
  }
}
