import { GalleryImage } from './GalleryImage.mts'
import { CHECK, IS_ARRAY, IS_NON_EMPTY, IS_RECORD } from './Assertions.mts'
import { GET_RANDOM_ITEM } from './Random.mts'

interface RedditPost {
  readonly title: string
  readonly url: string
}

export class RedditImageSource {
  public readonly type: 'reddit' = 'reddit'

  public static Create(subreddit: string): RedditImageSource {
    CHECK(IS_NON_EMPTY(subreddit), 'Subreddit is required')
    return new RedditImageSource(subreddit.trim())
  }

  private constructor(public readonly subreddit: string) {}

  public Describe(): string {
    return `r/${this.subreddit}`
  }

  public async FetchImage(): Promise<GalleryImage> {
    const response = await fetch(this.BuildUrl())
    CHECK(response.ok, `Reddit request failed with status ${response.status}`)
    const payload: unknown = await response.json()
    const posts = RedditListingParser.Collect(payload)
    CHECK(posts.length > 0, 'Reddit response did not include any usable images')
    const randomPost = GET_RANDOM_ITEM(posts)
    return GalleryImage.Create({
      url: randomPost.url,
      label: `${randomPost.title} — ${this.Describe()}`,
      sourceType: 'reddit'
    })
  }

  private BuildUrl(): string {
    return `https://www.reddit.com/r/${encodeURIComponent(this.subreddit)}/hot.json?limit=50`
  }
}

class RedditListingParser {
  public static Collect(payload: unknown): readonly RedditPost[] {
    if (!IS_RECORD(payload)) {
      return []
    }
    const listingData = payload.data
    if (!IS_RECORD(listingData)) {
      return []
    }
    const children = listingData.children
    if (!IS_ARRAY(children)) {
      return []
    }
    const posts: RedditPost[] = []
    for (const child of children) {
      if (!IS_RECORD(child)) {
        continue
      }
      const childData = child.data
      if (!IS_RECORD(childData)) {
        continue
      }
      const titleRaw = childData.title
      if (typeof titleRaw !== 'string') {
        continue
      }
      const url = this.ResolveUrl(childData)
      if (!url) {
        continue
      }
      posts.push({
        title: titleRaw,
        url
      })
    }
    return posts
  }

  private static ResolveUrl(postData: Record<string, unknown>): string | undefined {
    const directUrl = this.ExtractDirectUrl(postData)
    if (directUrl) {
      return directUrl
    }
    const previewUrl = this.ExtractPreviewUrl(postData)
    if (previewUrl) {
      return previewUrl
    }
    return undefined
  }

  private static ExtractDirectUrl(postData: Record<string, unknown>): string | undefined {
    const directCandidate = postData.url_overridden_by_dest
    if (typeof directCandidate === 'string' && this.IsImageUrl(directCandidate)) {
      return this.NormalizeUrl(directCandidate)
    }
    return undefined
  }

  private static ExtractPreviewUrl(postData: Record<string, unknown>): string | undefined {
    const previewValue = postData.preview
    if (!IS_RECORD(previewValue)) {
      return undefined
    }
    const imagesValue = previewValue.images
    if (!IS_ARRAY(imagesValue) || imagesValue.length === 0) {
      return undefined
    }
    const first = imagesValue[0]
    if (!IS_RECORD(first)) {
      return undefined
    }
    const sourceValue = first.source
    if (!IS_RECORD(sourceValue)) {
      return undefined
    }
    const urlValue = sourceValue.url
    if (typeof urlValue !== 'string') {
      return undefined
    }
    return this.NormalizeUrl(urlValue)
  }

  private static IsImageUrl(value: string): boolean {
    const normalized = value.toLowerCase()
    return normalized.endsWith('.jpg') || normalized.endsWith('.jpeg') || normalized.endsWith('.png') || normalized.endsWith('.gif')
  }

  private static NormalizeUrl(value: string): string {
    return value.replace(/&amp;/g, '&')
  }
}
