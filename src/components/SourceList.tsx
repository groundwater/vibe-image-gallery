import { GallerySourceEntry } from '../lib/GallerySourceEntry.mts'

interface SourceListProps {
  readonly entries: readonly GallerySourceEntry[]
  readonly onRemove: (id: string) => void
  readonly onClear: () => void
}

export default function SourceList({ entries, onRemove, onClear }: SourceListProps): JSX.Element {
  if (entries.length === 0) {
    return (
      <div className="source-list">
        <p className="source-list__empty">No sources yet.</p>
      </div>
    )
  }
  return (
    <div className="source-list">
      <div className="source-list__header">
        <button type="button" className="source-list__clear" onClick={onClear}>
          Clear
        </button>
      </div>
      <ul className="source-list__items">
        {entries.map((entry) => (
          <li key={entry.id} className="source-list__item">
            <span>{entry.Describe()}</span>
            <button type="button" onClick={() => onRemove(entry.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
