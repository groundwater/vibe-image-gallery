import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import './App.css'
import { GallerySourceFactory, GallerySourceKind } from './lib/GallerySourceFactory.mts'
import { GallerySourceEntry } from './lib/GallerySourceEntry.mts'
import { GalleryImage } from './lib/GalleryImage.mts'
import { CHECK } from './lib/Assertions.mts'
import { SourcePersistence } from './lib/SourcePersistence.mts'
import { PacePersistence } from './lib/PacePersistence.mts'
import { InfoFlashTimer } from './lib/InfoFlashTimer.mts'
import SourceForm from './components/SourceForm'
import SourceList from './components/SourceList'
import GalleryControls from './components/GalleryControls'
import GalleryViewport from './components/GalleryViewport'
import { SourcePresetEntry } from './lib/SourcePresetCatalog.mts'
import { GalleryImagePicker } from './lib/GalleryImagePicker.mts'

type OptionalImage = GalleryImage | undefined

type GalleryAction =
  | { type: 'add-source'; entry: GallerySourceEntry }
  | { type: 'remove-source'; id: string }
  | { type: 'clear-sources' }
  | { type: 'set-playing'; value: boolean }
  | { type: 'set-pace'; paceMs: number }
  | { type: 'set-image'; image: GalleryImage }
  | { type: 'set-error'; message: string | undefined }
  | { type: 'show-previous' }
  | { type: 'show-future' }

interface GalleryState {
  readonly entries: readonly GallerySourceEntry[]
  readonly currentImage: OptionalImage
  readonly isPlaying: boolean
  readonly paceMs: number
  readonly errorMessage: string | undefined
  readonly history: readonly GalleryImage[]
  readonly future: readonly GalleryImage[]
}

const initialState: GalleryState = {
  entries: [],
  currentImage: undefined,
  isPlaying: false,
  paceMs: 5000,
  errorMessage: undefined,
  history: [],
  future: []
}

const INFO_FLASH_DURATION_MS = 2500

function initializeGalleryState(): GalleryState {
  const storedEntries = SourcePersistence.Load()
  const storedPace = PacePersistence.Load(initialState.paceMs)
  if (storedEntries.length === 0) {
    return {
      ...initialState,
      paceMs: storedPace
    }
  }
  return {
    ...initialState,
    entries: storedEntries,
    paceMs: storedPace
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
    case 'clear-sources': {
      if (state.entries.length === 0) {
        return state
      }
      return {
        ...state,
        entries: [],
        currentImage: undefined,
        isPlaying: false,
        errorMessage: undefined,
        history: [],
        future: []
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
      const nextHistory = state.currentImage ? [...state.history, state.currentImage] : state.history
      return {
        ...state,
        currentImage: action.image,
        errorMessage: undefined,
        history: nextHistory,
        future: []
      }
    }
    case 'set-error': {
      return {
        ...state,
        errorMessage: action.message
      }
    }
    case 'show-previous': {
      if (state.history.length === 0) {
        return state
      }
      const previousIndex = state.history.length - 1
      const previousImage = state.history[previousIndex]
      const nextHistory = state.history.slice(0, previousIndex)
      const nextFuture = state.currentImage ? [state.currentImage, ...state.future] : state.future
      return {
        ...state,
        currentImage: previousImage,
        history: nextHistory,
        future: nextFuture
      }
    }
    case 'show-future': {
      if (state.future.length === 0) {
        return state
      }
      const [nextImage, ...remainingFuture] = state.future
      const nextHistory = state.currentImage ? [...state.history, state.currentImage] : state.history
      return {
        ...state,
        currentImage: nextImage,
        history: nextHistory,
        future: remainingFuture
      }
    }
    default:
      return state
  }
}

export default function App(): JSX.Element {
  const [state, dispatch] = useReducer(galleryReducer, initialState, initializeGalleryState)
  const galleryRef = useRef<HTMLDivElement | null>(null)
  const playbackRef = useRef<PlaybackLoop | undefined>(undefined)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isChromeVisible, setIsChromeVisible] = useState(true)
  const chromeHideTimerRef = useRef<number | undefined>(undefined)
  const [isInfoPinned, setIsInfoPinned] = useState(false)
  const [isInfoVisible, setIsInfoVisible] = useState(false)
  const infoFlashRef = useRef<InfoFlashTimer | undefined>(undefined)

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
      playbackRef.current = undefined
      return
    }
    const loop = new PlaybackLoop(
      state.entries,
      state.paceMs,
      (image) => dispatch({ type: 'set-image', image }),
      (message) => dispatch({ type: 'set-error', message })
    )
    playbackRef.current = loop
    return () => {
      loop.Stop()
      if (playbackRef.current === loop) {
        playbackRef.current = undefined
      }
    }
  }, [state.isPlaying, state.entries, state.paceMs, dispatch])

  useEffect(() => {
    SourcePersistence.Save(state.entries)
  }, [state.entries])

  useEffect(() => {
    PacePersistence.Save(state.paceMs)
  }, [state.paceMs])

  useEffect(() => {
    if (!isFullscreen) {
      setIsChromeVisible(true)
      if (chromeHideTimerRef.current !== undefined) {
        window.clearTimeout(chromeHideTimerRef.current)
        chromeHideTimerRef.current = undefined
      }
      return
    }

    const scheduleHide = () => {
      if (chromeHideTimerRef.current !== undefined) {
        window.clearTimeout(chromeHideTimerRef.current)
      }
      chromeHideTimerRef.current = window.setTimeout(() => {
        setIsChromeVisible(false)
      }, 3000)
    }

    const handlePointerActivity = () => {
      setIsChromeVisible(true)
      scheduleHide()
    }

    setIsChromeVisible(true)
    scheduleHide()
    document.addEventListener('pointermove', handlePointerActivity)
    document.addEventListener('pointerdown', handlePointerActivity)

    return () => {
      document.removeEventListener('pointermove', handlePointerActivity)
      document.removeEventListener('pointerdown', handlePointerActivity)
      if (chromeHideTimerRef.current !== undefined) {
        window.clearTimeout(chromeHideTimerRef.current)
        chromeHideTimerRef.current = undefined
      }
    }
  }, [isFullscreen])

  useEffect(() => {
    const timer = InfoFlashTimer.Create(() => {
      setIsInfoVisible(false)
    })
    infoFlashRef.current = timer
    return () => {
      timer.Dispose()
      if (infoFlashRef.current === timer) {
        infoFlashRef.current = undefined
      }
    }
  }, [])

  useEffect(() => {
    if (!state.errorMessage) {
      return
    }
    setIsInfoVisible(true)
    const timer = infoFlashRef.current
    if (!timer) {
      return
    }
    timer.Cancel()
    if (isInfoPinned) {
      return
    }
    timer.Flash(INFO_FLASH_DURATION_MS)
  }, [state.errorMessage, isInfoPinned])

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

  const handleAddPreset = (entries: readonly SourcePresetEntry[]) => {
    const existing = new Set(state.entries.map((entry) => entry.Describe()))
    let added = false
    for (const preset of entries) {
      try {
        const source = GallerySourceFactory.Create(preset.kind, preset.value)
        const entry = GallerySourceEntry.Create(source)
        const descriptor = entry.Describe()
        if (existing.has(descriptor)) {
          continue
        }
        existing.add(descriptor)
        dispatch({ type: 'add-source', entry })
        added = true
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        dispatch({ type: 'set-error', message })
        return
      }
    }
    if (!added) {
      dispatch({ type: 'set-error', message: 'All preset sources already added.' })
    }
  }

  const handleRemoveSource = (id: string) => {
    dispatch({ type: 'remove-source', id })
  }

  const handleClearSources = () => {
    dispatch({ type: 'clear-sources' })
  }

  const handleTogglePlayback = useCallback(() => {
    dispatch({ type: 'set-playing', value: !state.isPlaying })
  }, [dispatch, state.isPlaying])

  const handleFlashInfo = useCallback(() => {
    setIsInfoVisible(true)
    if (isInfoPinned) {
      return
    }
    const timer = infoFlashRef.current
    if (!timer) {
      return
    }
    timer.Flash(INFO_FLASH_DURATION_MS)
  }, [isInfoPinned])

  const handleToggleInfoPinned = useCallback(() => {
    setIsInfoPinned((current) => {
      const next = !current
      if (next) {
        setIsInfoVisible(true)
        const timer = infoFlashRef.current
        if (timer) {
          timer.Cancel()
        }
      } else {
        setIsInfoVisible(false)
        const timer = infoFlashRef.current
        if (timer) {
          timer.Cancel()
        }
      }
      return next
    })
  }, [])

  const handlePaceChange = (paceMs: number) => {
    dispatch({ type: 'set-pace', paceMs })
  }

  const handleShowPrevious = useCallback(() => {
    if (state.history.length === 0) {
      return
    }
    dispatch({ type: 'show-previous' })
    if (state.isPlaying) {
      const loop = playbackRef.current
      if (loop) {
        loop.RestartCountdown()
      }
    }
  }, [dispatch, state.history.length, state.isPlaying])

  const handleShowNext = useCallback(async () => {
    if (state.future.length > 0) {
      dispatch({ type: 'show-future' })
      if (state.isPlaying) {
        const loop = playbackRef.current
        if (loop) {
          loop.RestartCountdown()
        }
      }
      return
    }
    if (state.entries.length === 0) {
      return
    }
    try {
      const image = await GalleryImagePicker.FetchRandom(state.entries)
      dispatch({ type: 'set-image', image })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      dispatch({ type: 'set-error', message })
    }
    if (state.isPlaying) {
      const loop = playbackRef.current
      if (loop) {
        loop.RestartCountdown()
      }
    }
  }, [dispatch, state.future.length, state.entries, state.isPlaying])

  const handleRequestFullscreen = useCallback(async () => {
    const host = galleryRef.current
    if (!host) {
      return
    }
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }
    await host.requestFullscreen()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      const target = event.target
      if (target instanceof HTMLElement) {
        const tagName = target.tagName
        if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || target.isContentEditable) {
          return
        }
      }

      if (key === 'f' || key === 'F') {
        event.preventDefault()
        void handleRequestFullscreen()
        return
      }

      if (key === 'ArrowRight') {
        event.preventDefault()
        void handleShowNext()
        return
      }

      if (key === 'ArrowLeft') {
        event.preventDefault()
        handleShowPrevious()
        return
      }

      if (key === ' ' || key === 'Spacebar') {
        event.preventDefault()
        handleTogglePlayback()
        return
      }

      if (key === 'i' || key === 'I') {
        event.preventDefault()
        if (event.shiftKey) {
          handleToggleInfoPinned()
          return
        }
        handleFlashInfo()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleRequestFullscreen, handleShowNext, handleShowPrevious, handleTogglePlayback, handleFlashInfo, handleToggleInfoPinned])

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

  const showChrome = !isFullscreen || isChromeVisible
  const showInfo = isInfoPinned || isInfoVisible

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
            <SourceForm onAdd={handleAddSource} onAddPreset={handleAddPreset} isDisabled={state.isPlaying} />
            <SourceList entries={state.entries} onRemove={handleRemoveSource} onClear={handleClearSources} />
          </section>
        )}
        <section className="app__viewer">
          <GalleryViewport
            image={state.currentImage}
            infoText={infoText}
            isFullscreen={isFullscreen}
            isPlaying={state.isPlaying}
            showChrome={showChrome}
            showInfo={showInfo}
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

  public RestartCountdown(): void {
    if (!this.active) {
      return
    }
    if (this.timer !== undefined) {
      window.clearTimeout(this.timer)
      this.timer = undefined
    }
    this.ScheduleNext(this.paceMs)
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
      const image = await GalleryImagePicker.FetchRandom(this.entries)
      this.onError(undefined)
      this.onImage(image)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.onError(message)
    }
  }
}
