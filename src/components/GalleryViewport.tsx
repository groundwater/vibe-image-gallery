import { GalleryImage } from '../lib/GalleryImage.mts'

interface GalleryViewportProps {
  readonly image: GalleryImage | undefined
  readonly infoText: string
  readonly isFullscreen: boolean
}

export default function GalleryViewport({ image, infoText, isFullscreen }: GalleryViewportProps): JSX.Element {
  const className = isFullscreen ? 'gallery-viewport gallery-viewport--fullscreen' : 'gallery-viewport'
  return (
    <div className={className}>
      {image ? (
        <img src={image.url} alt={image.label} className="gallery-viewport__image" />
      ) : (
        <div className="gallery-viewport__placeholder">No image yet.</div>
      )}
      {!isFullscreen && <p className="gallery-viewport__info">{infoText}</p>}
    </div>
  )
}
