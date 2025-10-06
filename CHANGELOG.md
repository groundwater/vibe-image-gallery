# Changelog

## [Unreleased]

- Add a GitHub Actions workflow that builds main, uploads the static artifact, and deploys it with GitHub Pages actions while keeping Vite asset paths relative. (#18)
- Add subreddit preset buttons for rapid source configuration, covering nature, city, synthetic, organic, aesthetic, and scholastic themes. (#3)
- Keep the preset form fixed, scroll added sources independently, and provide a Clear button to remove every source at once.
- Resize the gallery viewport with the window and ensure images scale to the available space. (#4)
- Persist slideshow pace, hide fullscreen chrome after idle with an 'f' shortcut, and require `unsplash=on` to reveal Unsplash inputs. (#7)
- Enable keyboard navigation so the space bar toggles playback while the left and right arrows step the slideshow and reset its timer. (#12)
- Add an on-stage info overlay that flashes with `i` and stays pinned via `shift+i`, keeping errors and metadata accessible. (#14)
- Convert the Reddit source into a plugin, add Flickr, Wikimedia Commons, and Met Museum image feeds with presets, and gate non-Reddit sources behind page toggles. (#15)
- Capture a Playwright-powered UI screenshot via `npm run screenshot` and embed it in the README.

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
