import { ChangeEvent } from 'react'

interface GalleryControlsProps {
  readonly isPlaying: boolean
  readonly canPlay: boolean
  readonly paceMs: number
  readonly onTogglePlayback: () => void
  readonly onPaceChange: (paceMs: number) => void
  readonly onFullscreen: () => void
}

const MIN_PACE = 2000
const MAX_PACE = 20000
const STEP = 500

export default function GalleryControls(props: GalleryControlsProps): JSX.Element {
  const { isPlaying, canPlay, paceMs, onTogglePlayback, onPaceChange, onFullscreen } = props

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number.parseInt(event.target.value, 10)
    onPaceChange(nextValue)
  }

  const seconds = (paceMs / 1000).toFixed(1)

  return (
    <div className="gallery-controls">
      <div className="gallery-controls__main">
        <button type="button" onClick={onTogglePlayback} disabled={!canPlay}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button type="button" onClick={onFullscreen}>
          Full Screen
        </button>
      </div>
      <label className="gallery-controls__slider">
        Pace: {seconds}s
        <input
          type="range"
          min={MIN_PACE}
          max={MAX_PACE}
          step={STEP}
          value={paceMs}
          onChange={handleSliderChange}
        />
      </label>
    </div>
  )
}
