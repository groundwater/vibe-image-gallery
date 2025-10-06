export class InfoFlashTimer {
  private timer: ReturnType<typeof setTimeout> | undefined

  private constructor(private readonly onElapsed: () => void) {}

  public static Create(onElapsed: () => void): InfoFlashTimer {
    return new InfoFlashTimer(onElapsed)
  }

  public Flash(durationMs: number): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.timer = undefined
      this.onElapsed()
    }, durationMs)
  }

  public Cancel(): void {
    if (this.timer === undefined) {
      return
    }
    clearTimeout(this.timer)
    this.timer = undefined
  }

  public Dispose(): void {
    this.Cancel()
  }
}
