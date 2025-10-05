import { FormEvent, useState, ChangeEvent } from 'react'
import { GallerySourceKind } from '../lib/GallerySourceFactory.mts'
import { SourcePresetCatalog, SourcePresetEntry } from '../lib/SourcePresetCatalog.mts'

interface SourceFormProps {
  readonly onAdd: (kind: GallerySourceKind, value: string) => void
  readonly onAddPreset: (entries: readonly SourcePresetEntry[]) => void
  readonly isDisabled: boolean
}

const presetGroups = SourcePresetCatalog.All()

export default function SourceForm({ onAdd, onAddPreset, isDisabled }: SourceFormProps): JSX.Element {
  const [redditValue, setRedditValue] = useState('')
  const [unsplashValue, setUnsplashValue] = useState('')

  const handleRedditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isDisabled) {
      return
    }
    onAdd('reddit', redditValue)
    setRedditValue('')
  }

  const handleUnsplashSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isDisabled) {
      return
    }
    onAdd('unsplash', unsplashValue)
    setUnsplashValue('')
  }

  const handleRedditChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRedditValue(event.target.value)
  }

  const handleUnsplashChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUnsplashValue(event.target.value)
  }

  const handlePresetAdd = (entries: readonly SourcePresetEntry[]) => {
    if (isDisabled) {
      return
    }
    onAddPreset(entries)
  }

  return (
    <div className="source-form">
      <h2>Sources</h2>
      <div className="source-form__scroll">
        <div className="source-form__item source-form__item--presets">
          <h3 className="source-form__preset-heading">Presets</h3>
          <div className="source-form__preset-list">
            {presetGroups.map((group) => (
              <button
                key={group.label}
                type="button"
                className="source-form__preset-button"
                onClick={() => handlePresetAdd(group.entries)}
                disabled={isDisabled}
                title={group.entries.map((entry) => entry.value).join(', ')}
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>
        <form className="source-form__item" onSubmit={handleRedditSubmit}>
          <label htmlFor="reddit-input">Reddit Subreddit</label>
          <div className="source-form__controls">
            <input
              id="reddit-input"
              type="text"
              value={redditValue}
              onChange={handleRedditChange}
              placeholder="e.g. EarthPorn"
              disabled={isDisabled}
            />
            <button type="submit" disabled={isDisabled}>
              Add
            </button>
          </div>
        </form>
        <form className="source-form__item" onSubmit={handleUnsplashSubmit}>
          <label htmlFor="unsplash-input">Unsplash Tag</label>
          <div className="source-form__controls">
            <input
              id="unsplash-input"
              type="text"
              value={unsplashValue}
              onChange={handleUnsplashChange}
              placeholder="e.g. nature"
              disabled={isDisabled}
            />
            <button type="submit" disabled={isDisabled}>
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
