import { GalleryImage } from '../lib/GalleryImage.mts'

interface GalleryViewportProps {
  readonly image: GalleryImage | undefined
  readonly infoText: string
}

export default function GalleryViewport({ image, infoText }: GalleryViewportProps): JSX.Element {
  return (
    <div className="gallery-viewport">
      {image ? (
        <img src={image.url} alt={image.label} className="gallery-viewport__image" />
      ) : (
        <div className="gallery-viewport__placeholder">No image yet.</div>
      )}
      <p className="gallery-viewport__info">{infoText}</p>
    </div>
  )
}
