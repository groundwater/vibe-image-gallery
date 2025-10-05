import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import './App.css'
import { GallerySourceFactory, GallerySourceKind } from './lib/GallerySourceFactory.mts'
import { GallerySourceEntry } from './lib/GallerySourceEntry.mts'
import { GalleryImage } from './lib/GalleryImage.mts'
import { CHECK } from './lib/Assertions.mts'
import { GET_RANDOM_ITEM } from './lib/Random.mts'
import { SourcePersistence } from './lib/SourcePersistence.mts'
import SourceForm from './components/SourceForm'
import SourceList from './components/SourceList'
import GalleryControls from './components/GalleryControls'
import GalleryViewport from './components/GalleryViewport'

type OptionalImage = GalleryImage | undefined

type GalleryAction =
  | { type: 'add-source'; entry: GallerySourceEntry }
  | { type: 'remove-source'; id: string }
  | { type: 'set-playing'; value: boolean }
  | { type: 'set-pace'; paceMs: number }
  | { type: 'set-image'; image: GalleryImage }
  | { type: 'set-error'; message: string | undefined }

interface GalleryState {
  readonly entries: readonly GallerySourceEntry[]
  readonly currentImage: OptionalImage
  readonly isPlaying: boolean
  readonly paceMs: number
  readonly errorMessage: string | undefined
}

const initialState: GalleryState = {
  entries: [],
  currentImage: undefined,
  isPlaying: false,
  paceMs: 5000,
  errorMessage: undefined
}

function initializeGalleryState(): GalleryState {
  const storedEntries = SourcePersistence.Load()
  if (storedEntries.length === 0) {
    return initialState
  }
  return {
    ...initialState,
    entries: storedEntries
  }
}

function galleryReducer(state: GalleryState, action: GalleryAction): GalleryState {
  switch (action.type) {
    case 'add-source': {
      const descriptor = action.entry.Describe()
      const exists = state.entries.some((candidate) => candidate.Describe() === descriptor)
      if (exists) {
        return {
          ...state,
          errorMessage: `Source already added: ${descriptor}`
        }
      }
      return {
        ...state,
        entries: [...state.entries, action.entry],
        errorMessage: undefined
      }
    }
    case 'remove-source': {
      const remaining = state.entries.filter((entry) => entry.id !== action.id)
      const shouldStop = remaining.length === 0
      return {
        ...state,
        entries: remaining,
        isPlaying: shouldStop ? false : state.isPlaying
      }
    }
    case 'set-playing': {
      if (action.value && state.entries.length === 0) {
        return state
      }
      return {
        ...state,
        isPlaying: action.value
      }
    }
    case 'set-pace': {
      return {
        ...state,
        paceMs: action.paceMs
      }
    }
    case 'set-image': {
      return {
        ...state,
        currentImage: action.image,
        errorMessage: undefined
      }
    }
    case 'set-error': {
      return {
        ...state,
        errorMessage: action.message
      }
    }
    default:
      return state
  }
}

export default function App(): JSX.Element {
  const [state, dispatch] = useReducer(galleryReducer, initialState, initializeGalleryState)
  const galleryRef = useRef<HTMLDivElement | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const canPlay = state.entries.length > 0

  useEffect(() => {
    const handleFullscreenChange = () => {
      const host = galleryRef.current
      setIsFullscreen(host !== null && document.fullscreenElement === host)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    handleFullscreenChange()
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    if (!state.isPlaying || state.entries.length === 0) {
      return
    }
    const loop = new PlaybackLoop(
      state.entries,
      state.paceMs,
      (image) => dispatch({ type: 'set-image', image }),
      (message) => dispatch({ type: 'set-error', message })
    )
    return () => {
      loop.Stop()
    }
  }, [state.isPlaying, state.entries, state.paceMs])

  useEffect(() => {
    SourcePersistence.Save(state.entries)
  }, [state.entries])

  const handleAddSource = (kind: GallerySourceKind, value: string) => {
    try {
      const source = GallerySourceFactory.Create(kind, value)
      const entry = GallerySourceEntry.Create(source)
      dispatch({ type: 'add-source', entry })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      dispatch({ type: 'set-error', message })
    }
  }

  const handleRemoveSource = (id: string) => {
    dispatch({ type: 'remove-source', id })
  }

  const handleTogglePlayback = () => {
    dispatch({ type: 'set-playing', value: !state.isPlaying })
  }

  const handlePaceChange = (paceMs: number) => {
    dispatch({ type: 'set-pace', paceMs })
  }

  const handleRequestFullscreen = async () => {
    const host = galleryRef.current
    if (!host) {
      return
    }
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }
    await host.requestFullscreen()
  }

  const infoText = useMemo(() => {
    if (state.errorMessage) {
      return state.errorMessage
    }
    if (!state.currentImage) {
      return 'Add a source and press play to start the gallery.'
    }
    return state.currentImage.label
  }, [state.errorMessage, state.currentImage])

  const appClassName = isFullscreen ? 'app app--fullscreen' : 'app'

  return (
    <div className={appClassName} ref={galleryRef}>
      {!isFullscreen && (
        <header className="app__header">
          <h1>Vibe Image Gallery</h1>
        </header>
      )}
      <main className="app__main">
        {!isFullscreen && (
          <section className="app__sources">
            <SourceForm onAdd={handleAddSource} isDisabled={state.isPlaying} />
            <SourceList entries={state.entries} onRemove={handleRemoveSource} />
          </section>
        )}
        <section className="app__viewer">
          <GalleryViewport
            image={state.currentImage}
            infoText={infoText}
            isFullscreen={isFullscreen}
            isPlaying={state.isPlaying}
            onTogglePlayback={handleTogglePlayback}
            onToggleFullscreen={handleRequestFullscreen}
          />
          {!isFullscreen && (
            <GalleryControls
              isPlaying={state.isPlaying}
              canPlay={canPlay}
              paceMs={state.paceMs}
              onTogglePlayback={handleTogglePlayback}
              onPaceChange={handlePaceChange}
            />
          )}
        </section>
      </main>
    </div>
  )
}

class PlaybackLoop {
  private active = true
  private timer: number | undefined

  public constructor(
    private readonly entries: readonly GallerySourceEntry[],
    private readonly paceMs: number,
    private readonly onImage: (image: GalleryImage) => void,
    private readonly onError: (message: string | undefined) => void
  ) {
    CHECK(this.entries.length > 0, 'Playback requires at least one source')
    this.ScheduleNext(0)
  }

  public Stop(): void {
    this.active = false
    if (this.timer !== undefined) {
      window.clearTimeout(this.timer)
      this.timer = undefined
    }
  }

  private ScheduleNext(delay: number): void {
    if (!this.active) {
      return
    }
    this.timer = window.setTimeout(async () => {
      await this.Iterate()
      this.ScheduleNext(this.paceMs)
    }, delay)
  }

  private async Iterate(): Promise<void> {
    try {
      const entry = GET_RANDOM_ITEM(this.entries)
      const image = await entry.source.FetchImage()
      this.onError(undefined)
      this.onImage(image)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.onError(message)
    }
  }
}
