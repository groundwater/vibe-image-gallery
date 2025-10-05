import { GallerySourceEntry } from '../lib/GallerySourceEntry.mts'

interface SourceListProps {
  readonly entries: readonly GallerySourceEntry[]
  readonly onRemove: (id: string) => void
}

export default function SourceList({ entries, onRemove }: SourceListProps): JSX.Element {
  if (entries.length === 0) {
    return <p className="source-list__empty">No sources yet.</p>
  }
  return (
    <ul className="source-list">
      {entries.map((entry) => (
        <li key={entry.id} className="source-list__item">
          <span>{entry.Describe()}</span>
          <button type="button" onClick={() => onRemove(entry.id)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  )
}
