export class PageOptions {
  private static readonly onValue = 'on'
  private static readonly unsplashKey = 'unsplash'
  private static readonly flickrKey = 'flickr'
  private static readonly wikimediaKey = 'wikimedia'
  private static readonly metKey = 'met'

  public static ShouldShowUnsplash(): boolean {
    return this.IsEnabled(this.unsplashKey)
  }

  public static ShouldShowFlickr(): boolean {
    return this.IsEnabled(this.flickrKey)
  }

  public static ShouldShowWikimedia(): boolean {
    return this.IsEnabled(this.wikimediaKey)
  }

  public static ShouldShowMetMuseum(): boolean {
    return this.IsEnabled(this.metKey)
  }

  private static IsEnabled(key: string): boolean {
    if (typeof window === 'undefined') {
      return false
    }
    const params = new URLSearchParams(window.location.search)
    const value = params.get(key)
    return value === this.onValue
  }
}
