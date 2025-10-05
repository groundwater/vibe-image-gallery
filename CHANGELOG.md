# Changelog

## [0.1.0] - 2025-10-04

- Scaffold the initial Vite + React TypeScript gallery experience with live Reddit and Unsplash sources.
- Add playback controls, source management UI, and helper utilities that enforce stricter runtime guarantees.
- Introduce a minimal Node-based unit test covering gallery image constraints and random selection.
- Refine fullscreen mode so only the current image is shown edge-to-edge without auxiliary controls.
- Persist configured sources through reloads and add coverage for the storage utility.
- Resolve Unsplash sourcing by following redirects to the concrete image asset.
- Allow fullscreen tap-to-toggle playback with a paused overlay and swap the control to use an icon button.
- Expand the pacing slider to exponential stops up to thirty minutes and surface pause directly on the viewport chrome.
- Fit oversized images within the viewport and relocate play/fullscreen controls into overlay icons.
