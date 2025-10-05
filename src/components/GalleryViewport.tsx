import { KeyboardEvent } from 'react'
import { Play } from 'lucide-react'
import { GalleryImage } from '../lib/GalleryImage.mts'

interface GalleryViewportProps {
  readonly image: GalleryImage | undefined
  readonly infoText: string
  readonly isFullscreen: boolean
  readonly isPlaying: boolean
  readonly onTogglePlayback: () => void
}

export default function GalleryViewport(props: GalleryViewportProps): JSX.Element {
  const { image, infoText, isFullscreen, isPlaying, onTogglePlayback } = props
  const className = isFullscreen ? 'gallery-viewport gallery-viewport--fullscreen' : 'gallery-viewport'
  const shouldHandleInteraction = isFullscreen

  const handleClick = () => {
    if (!shouldHandleInteraction) {
      return
    }
    onTogglePlayback()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!shouldHandleInteraction) {
      return
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      onTogglePlayback()
    }
  }

  const roleValue = shouldHandleInteraction ? 'button' : undefined
  const tabIndexValue = shouldHandleInteraction ? 0 : undefined
  const label = shouldHandleInteraction ? (isPlaying ? 'Pause slideshow' : 'Play slideshow') : undefined

  return (
    <div
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={roleValue}
      tabIndex={tabIndexValue}
      aria-label={label}
    >
      {image ? (
        <img src={image.url} alt={image.label} className="gallery-viewport__image" />
      ) : (
        <div className="gallery-viewport__placeholder">No image yet.</div>
      )}
      {!isFullscreen && <p className="gallery-viewport__info">{infoText}</p>}
      {isFullscreen && !isPlaying && (
        <div className="gallery-viewport__overlay" aria-hidden="true">
          <Play className="gallery-viewport__overlay-icon" />
        </div>
      )}
    </div>
  )
}
