import { FormEvent, useState, ChangeEvent } from 'react'
import { GallerySourceKind } from '../lib/GallerySourceFactory.mts'
import { SourcePresetCatalog, SourcePresetEntry } from '../lib/SourcePresetCatalog.mts'
import { PageOptions } from '../lib/PageOptions.mts'

interface SourceFormProps {
  readonly onAdd: (kind: GallerySourceKind, value: string) => void
  readonly onAddPreset: (entries: readonly SourcePresetEntry[]) => void
  readonly isDisabled: boolean
}

const presetGroups = SourcePresetCatalog.All()

export default function SourceForm({ onAdd, onAddPreset, isDisabled }: SourceFormProps): JSX.Element {
  const [redditValue, setRedditValue] = useState('')
  const [unsplashValue, setUnsplashValue] = useState('')
  const [flickrValue, setFlickrValue] = useState('')
  const [wikimediaValue, setWikimediaValue] = useState('')
  const [metValue, setMetValue] = useState('')
  const isUnsplashEnabled = PageOptions.ShouldShowUnsplash()
  const isFlickrEnabled = PageOptions.ShouldShowFlickr()
  const isWikimediaEnabled = PageOptions.ShouldShowWikimedia()
  const isMetEnabled = PageOptions.ShouldShowMetMuseum()

  const handleSubmit = (event: FormEvent<HTMLFormElement>, kind: GallerySourceKind, value: string, clear: (next: string) => void) => {
    event.preventDefault()
    if (isDisabled) {
      return
    }
    onAdd(kind, value)
    clear('')
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    setter(event.target.value)
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
        <form
          className="source-form__item"
          onSubmit={(event) => handleSubmit(event, 'reddit', redditValue, setRedditValue)}
        >
          <label htmlFor="reddit-input">Reddit Subreddit</label>
          <div className="source-form__controls">
            <input
              id="reddit-input"
              type="text"
              value={redditValue}
              onChange={(event) => handleInputChange(event, setRedditValue)}
              placeholder="e.g. EarthPorn"
              disabled={isDisabled}
            />
            <button type="submit" disabled={isDisabled}>
              Add
            </button>
          </div>
        </form>
        {isUnsplashEnabled && (
          <form
            className="source-form__item"
            onSubmit={(event) => handleSubmit(event, 'unsplash', unsplashValue, setUnsplashValue)}
          >
            <label htmlFor="unsplash-input">Unsplash Tag</label>
            <div className="source-form__controls">
              <input
                id="unsplash-input"
                type="text"
                value={unsplashValue}
                onChange={(event) => handleInputChange(event, setUnsplashValue)}
                placeholder="e.g. nature"
                disabled={isDisabled}
              />
              <button type="submit" disabled={isDisabled}>
                Add
              </button>
            </div>
          </form>
        )}
        {isFlickrEnabled && (
          <form
            className="source-form__item"
            onSubmit={(event) => handleSubmit(event, 'flickr', flickrValue, setFlickrValue)}
          >
            <label htmlFor="flickr-input">Flickr Tags</label>
            <div className="source-form__controls">
              <input
                id="flickr-input"
                type="text"
                value={flickrValue}
                onChange={(event) => handleInputChange(event, setFlickrValue)}
                placeholder="e.g. landscape, sunrise"
                disabled={isDisabled}
              />
              <button type="submit" disabled={isDisabled}>
                Add
              </button>
            </div>
          </form>
        )}
        {isWikimediaEnabled && (
          <form
            className="source-form__item"
            onSubmit={(event) => handleSubmit(event, 'wikimedia-commons', wikimediaValue, setWikimediaValue)}
          >
            <label htmlFor="wikimedia-input">Wikimedia Commons Search</label>
            <div className="source-form__controls">
              <input
                id="wikimedia-input"
                type="text"
                value={wikimediaValue}
                onChange={(event) => handleInputChange(event, setWikimediaValue)}
                placeholder="e.g. aurora borealis"
                disabled={isDisabled}
              />
              <button type="submit" disabled={isDisabled}>
                Add
              </button>
            </div>
          </form>
        )}
        {isMetEnabled && (
          <form
            className="source-form__item"
            onSubmit={(event) => handleSubmit(event, 'met-museum', metValue, setMetValue)}
          >
            <label htmlFor="met-input">The Met Museum Search</label>
            <div className="source-form__controls">
              <input
                id="met-input"
                type="text"
                value={metValue}
                onChange={(event) => handleInputChange(event, setMetValue)}
                placeholder="e.g. sunflower"
                disabled={isDisabled}
              />
              <button type="submit" disabled={isDisabled}>
                Add
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
