import { FlickrImageSourcePlugin } from './plugins/FlickrImageSourcePlugin.mts'
import { MetMuseumImageSourcePlugin } from './plugins/MetMuseumImageSourcePlugin.mts'
import { RedditImageSourcePlugin } from './plugins/RedditImageSourcePlugin.mts'
import { UnsplashImageSourcePlugin } from './plugins/UnsplashImageSourcePlugin.mts'
import { WikimediaCommonsImageSourcePlugin } from './plugins/WikimediaCommonsImageSourcePlugin.mts'

export type GallerySource =
  | RedditImageSourcePlugin
  | UnsplashImageSourcePlugin
  | FlickrImageSourcePlugin
  | WikimediaCommonsImageSourcePlugin
  | MetMuseumImageSourcePlugin

export type GallerySourceKind =
  | 'reddit'
  | 'unsplash'
  | 'flickr'
  | 'wikimedia-commons'
  | 'met-museum'

export class GallerySourceFactory {
  public static Create(kind: GallerySourceKind, value: string): GallerySource {
    switch (kind) {
      case 'reddit':
        return RedditImageSourcePlugin.Create(value)
      case 'unsplash':
        return UnsplashImageSourcePlugin.Create(value)
      case 'flickr':
        return FlickrImageSourcePlugin.Create(value)
      case 'wikimedia-commons':
        return WikimediaCommonsImageSourcePlugin.Create(value)
      case 'met-museum':
        return MetMuseumImageSourcePlugin.Create(value)
      default: {
        throw new Error(`Unsupported source kind ${kind}`)
      }
    }
  }
}
