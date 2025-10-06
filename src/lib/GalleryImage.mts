import { CHECK, IS_NON_EMPTY } from './Assertions.mts'

export type GallerySourceType =
  | 'reddit'
  | 'unsplash'
  | 'flickr'
  | 'wikimedia-commons'
  | 'met-museum'

export class GalleryImage {
  public static Create(args: {
    url: string
    label: string
    sourceType: GallerySourceType
  }): GalleryImage {
    return new GalleryImage(args.url, args.label, args.sourceType, Date.now())
  }

  private constructor(
    public readonly url: string,
    public readonly label: string,
    public readonly sourceType: GallerySourceType,
    public readonly acquiredAt: number
  ) {
    CHECK(IS_NON_EMPTY(url), 'Image URL must be provided')
    CHECK(IS_NON_EMPTY(label), 'Image label must be provided')
    CHECK(url.startsWith('http'), 'Image URL must be absolute')
  }
}
