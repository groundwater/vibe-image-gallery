# Vibe Image Gallery

![100% Vibe Coded](https://badges.ws/badge/100%25-Vibe%20Coded-ff0000)

> This is vibe coded by gpt-5-codex

Vibe Image Gallery is a Vite + React TypeScript single-page app for building a rotating slideshow sourced from Reddit subreddits and Unsplash tags.

## Features

- Manage a scrollable catalog of Reddit and Unsplash sources and build a playlist-like queue
- Randomly rotate through fetched images once playback starts, with custom pacing controls
- Toggle full screen viewing and adjust slide duration with an intuitive slider
- Strong runtime guards powered by helper assertions to keep the UI honest

## Getting Started

```sh
npm install
npm run dev
```

Open `http://localhost:5173` in your browser to try the gallery. Add one or more sources, then press **Play**.

## Testing

Tests run directly against the TypeScript sources using the Node test runner:

```sh
npm test
```

A production build is available via `npm run build`, which runs the type checker before generating optimized assets.
