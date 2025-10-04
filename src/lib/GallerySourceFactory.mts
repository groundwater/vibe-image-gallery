import { RedditImageSource } from './RedditImageSource.mts'
import { UnsplashImageSource } from './UnsplashImageSource.mts'

export type GallerySource = RedditImageSource | UnsplashImageSource
export type GallerySourceKind = 'reddit' | 'unsplash'

export class GallerySourceFactory {
  public static Create(kind: GallerySourceKind, value: string): GallerySource {
    switch (kind) {
      case 'reddit':
        return RedditImageSource.Create(value)
      case 'unsplash':
        return UnsplashImageSource.Create(value)
      default: {
        throw new Error(`Unsupported source kind ${kind}`)
      }
    }
  }
}
