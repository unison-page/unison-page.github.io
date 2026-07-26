# UNISON project page

This folder contains a self-contained static project page for:

**UNISON: Unified Hand Interaction State Generation**

Open `index.html` directly, or serve this directory with any static HTTP server.
All figures and videos used by the page are stored locally under `assets/`.

## Structure

- `index.html` — project-page content and section structure
- `css/app.css` — responsive layout and visual styling
- `js/app.js` — video galleries, lazy loading, motion controls, and navigation
- `assets/images/` — renamed paper figures and episode timelines
- `assets/videos/` — all 98 recursively collected and renamed MP4 files
- `assets/asset_manifest.csv` — source-to-destination filename mapping

Videos are loaded only when they approach the viewport. This keeps the initial
page lightweight while retaining every supplied clip in the project page.
