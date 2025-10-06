import { GalleryImage } from '../GalleryImage.mts'
import { CHECK, IS_NON_EMPTY } from '../Assertions.mts'

export class UnsplashImageSourcePlugin {
  public readonly type: 'unsplash' = 'unsplash'

  public static Create(tag: string): UnsplashImageSourcePlugin {
    CHECK(IS_NON_EMPTY(tag), 'Unsplash tag is required')
    return new UnsplashImageSourcePlugin(tag.trim())
  }

  private constructor(public readonly tag: string) {}

  public Describe(): string {
    return `Unsplash: ${this.tag}`
  }

  public async FetchImage(): Promise<GalleryImage> {
    const url = await this.ResolveImageUrl()
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

  private async ResolveImageUrl(): Promise<string> {
    const requestUrl = this.BuildUrl()
    const response = await fetch(requestUrl, {
      method: 'HEAD',
      redirect: 'follow',
      cache: 'no-store'
    })
    CHECK(response.ok, `Unsplash request failed with status ${response.status}`)
    const finalUrl = response.url
    CHECK(IS_NON_EMPTY(finalUrl), 'Unsplash response missing final url')
    CHECK(finalUrl.startsWith('http'), 'Unsplash response url must be absolute')
    return finalUrl
  }
}
