export class PageOptions {
  private static readonly unsplashKey = 'unsplash'
  private static readonly unsplashOnValue = 'on'

  public static ShouldShowUnsplash(): boolean {
    if (typeof window === 'undefined') {
      return false
    }
    const params = new URLSearchParams(window.location.search)
    const value = params.get(this.unsplashKey)
    return value === this.unsplashOnValue
  }
}
