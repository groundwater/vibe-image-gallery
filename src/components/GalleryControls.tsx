import { ChangeEvent, useMemo } from 'react'

interface GalleryControlsProps {
  readonly isPlaying: boolean
  readonly canPlay: boolean
  readonly paceMs: number
  readonly onTogglePlayback: () => void
  readonly onPaceChange: (paceMs: number) => void
}

const PACE_OPTIONS: readonly number[] = [
  1000,
  5000,
  10000,
  30000,
  60000,
  300000,
  900000,
  1800000
]

export default function GalleryControls(props: GalleryControlsProps): JSX.Element {
  const { isPlaying, canPlay, paceMs, onTogglePlayback, onPaceChange } = props

  const sliderIndex = useMemo(() => {
    let bestIndex = 0
    let smallestDistance = Number.POSITIVE_INFINITY
    for (let i = 0; i < PACE_OPTIONS.length; i += 1) {
      const option = PACE_OPTIONS[i]
      if (option === undefined) {
        continue
      }
      const distance = Math.abs(option - paceMs)
      if (distance < smallestDistance) {
        smallestDistance = distance
        bestIndex = i
      }
    }
    return bestIndex
  }, [paceMs])

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextIndex = Number.parseInt(event.target.value, 10)
    if (Number.isNaN(nextIndex)) {
      return
    }
    onPaceChange(GET_PACE_OPTION(nextIndex))
  }

  const currentPace = GET_PACE_OPTION(sliderIndex)
  const formattedPace = FORMAT_DURATION(currentPace)

  return (
    <div className="gallery-controls">
      {isPlaying && (
        <button type="button" onClick={onTogglePlayback} className="gallery-controls__pause" disabled={!canPlay}>
          Pause
        </button>
      )}
      <label className="gallery-controls__slider">
        Pace: {formattedPace}
        <input
          type="range"
          min={0}
          max={PACE_OPTIONS.length - 1}
          step={1}
          value={sliderIndex}
          onChange={handleSliderChange}
          aria-valuetext={formattedPace}
        />
      </label>
    </div>
  )
}

function FORMAT_DURATION(durationMs: number): string {
  if (durationMs < 60000) {
    const seconds = Math.round(durationMs / 1000)
    return `${seconds}s`
  }
  const minutes = Math.round(durationMs / 60000)
  return `${minutes}m`
}

function GET_PACE_OPTION(index: number): number {
  if (index <= 0) {
    const first = PACE_OPTIONS[0]
    return first === undefined ? 1000 : first
  }
  if (index >= PACE_OPTIONS.length - 1) {
    const last = PACE_OPTIONS[PACE_OPTIONS.length - 1]
    return last === undefined ? 1800000 : last
  }
  const option = PACE_OPTIONS[index]
  if (option === undefined) {
    const fallback = PACE_OPTIONS[PACE_OPTIONS.length - 1]
    return fallback === undefined ? 1800000 : fallback
  }
  return option
}
