import { Play, Pause, Maximize2, Minimize2 } from 'lucide-react'
import { GalleryImage } from '../lib/GalleryImage.mts'

interface GalleryViewportProps {
  readonly image: GalleryImage | undefined
  readonly infoText: string
  readonly isFullscreen: boolean
  readonly isPlaying: boolean
  readonly showChrome: boolean
  readonly showInfo: boolean
  readonly onTogglePlayback: () => void
  readonly onToggleFullscreen: () => void
}

export default function GalleryViewport(props: GalleryViewportProps): JSX.Element {
  const { image, infoText, isFullscreen, isPlaying, showChrome, showInfo, onTogglePlayback, onToggleFullscreen } = props
  const className = isFullscreen ? 'gallery-viewport gallery-viewport--fullscreen' : 'gallery-viewport'
  const stageClassName = isFullscreen ? 'gallery-viewport__stage gallery-viewport__stage--fullscreen' : 'gallery-viewport__stage'
  const fullscreenIcon = isFullscreen ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />
  const fullscreenLabel = isFullscreen ? 'Exit full screen' : 'Enter full screen'
  const showPlayButton = !isPlaying
  const chromeClassName = showChrome ? 'gallery-viewport__chrome' : 'gallery-viewport__chrome gallery-viewport__chrome--hidden'

  return (
    <div className={className}>
      <div className={stageClassName}>
        {image ? (
          <img src={image.url} alt={image.label} className="gallery-viewport__image" />
        ) : (
          <div className="gallery-viewport__placeholder">No image yet.</div>
        )}
        <div className={chromeClassName}>
          {showPlayButton && (
            <button type="button" className="gallery-viewport__play-button" onClick={onTogglePlayback}>
              <Play aria-hidden="true" />
              <span className="sr-only">Start slideshow</span>
            </button>
          )}
          {isPlaying && (
            <button type="button" className="gallery-viewport__pause-button" onClick={onTogglePlayback}>
              <Pause aria-hidden="true" />
              <span className="sr-only">Pause slideshow</span>
            </button>
          )}
          <button type="button" className="gallery-viewport__fullscreen-button" onClick={onToggleFullscreen}>
            {fullscreenIcon}
            <span className="sr-only">{fullscreenLabel}</span>
          </button>
        </div>
        {showInfo && (
          <div className="gallery-viewport__info" role="status" aria-live="polite">
            {infoText}
          </div>
        )}
      </div>
    </div>
  )
}
