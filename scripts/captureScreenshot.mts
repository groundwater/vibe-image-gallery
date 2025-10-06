import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdir } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from 'playwright'

function ASSERT(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message)
  }
}

async function WAIT_FOR_SERVER(origin: string, timeoutMs: number, intervalMs: number): Promise<void> {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(origin)
      if (response.ok || response.status >= 200) {
        return
      }
    } catch (error) {
      await delay(intervalMs)
      continue
    }
    await delay(intervalMs)
  }
  throw new Error(`Dev server did not become available at ${origin}`)
}

class ScreenshotRunner {
  private constructor(
    public readonly origin: string,
    public readonly screenshotPath: string,
    public readonly viewportWidth: number,
    public readonly viewportHeight: number,
    public readonly settleDelayMs: number,
  ) {}

  public static async Run(): Promise<void> {
    const runner = new ScreenshotRunner(
      'http://127.0.0.1:5173',
      'docs/gallery-screenshot.png',
      1440,
      900,
      2000,
    )
    await runner.Execute()
  }

  public async Execute(): Promise<void> {
    const server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173', '--strictPort'], {
      stdio: 'inherit',
      shell: false,
    })

    const stopServer = (): void => {
      if (!server.killed) {
        server.kill('SIGINT')
      }
    }

    process.on('SIGINT', stopServer)
    process.on('SIGTERM', stopServer)

    try {
      await WAIT_FOR_SERVER(this.origin, 15000, 200)
      const browser = await chromium.launch()
      try {
        const page = await browser.newPage()
        await page.setViewportSize({ width: this.viewportWidth, height: this.viewportHeight })
        const response = await page.goto(this.origin, { waitUntil: 'networkidle' })
        ASSERT(response !== null, 'Failed to load the gallery page')
        await page.waitForTimeout(this.settleDelayMs)
        await mkdir('docs', { recursive: true })
        await page.screenshot({ path: this.screenshotPath, fullPage: true })
      } finally {
        await browser.close()
      }
    } finally {
      stopServer()
      await once(server, 'exit')
      process.off('SIGINT', stopServer)
      process.off('SIGTERM', stopServer)
    }
  }
}

await ScreenshotRunner.Run()
