# Room Planner

A personal, locally-hosted room-layout tool — the v1 implementation of
[room-planner-PRD.md](room-planner-PRD.md), plus a 3D walkthrough view.

Everything lives in a single self-contained **`index.html`** (vanilla JS + HTML5 Canvas,
no build step, no network calls). Open it directly in a browser, or serve it with any
static server:

```sh
# either just double-click index.html, or:
python3 -m http.server 8000     # then visit http://localhost:8000
```

## What it does

- **Draw the room to scale** — polygon wall tool (`W`): click to drop corners, Shift for
  straight/45° segments, click the first corner or press Enter to close. Rectangles,
  L-shapes, any polygon. Walls render with real thickness and every segment shows its length.
- **Edit walls** — drag corners, double-click a wall to add a corner, select a wall and type
  an exact length, delete corners.
- **Doors & windows** (`D` / `N`) — click a wall to attach; drag along the wall to
  reposition. Doors show the standard swing arc with flip-hinge / flip-swing controls;
  windows use the double-line symbol. Openings stay anchored through wall edits.
- **Furniture** — a built-in palette (sofas, tables, beds, rugs, media, dining, office,
  decor, generic shapes) placed by click or drag; every piece is a real-scale footprint.
  Move, rotate (handle or numeric), resize (handles or typed dimensions), duplicate
  (Ctrl+D), z-order, labels, colors. Custom rectangles/circles (`R` / `C`) can be drawn at
  any size and saved into the palette ("My items") for reuse.
- **Recolor anything** — select one or more placed pieces and use the color picker (live
  preview) or the quick swatches in the properties panel; width/depth/rotation/label are
  editable there too.
- **Overlap warnings (opt-in)** — enable "Overlap warnings" in the settings panel (click
  empty space to see it) to get a red dashed outline on furniture that collides with
  another piece or crosses a wall. Off by default; rugs are exempt from furniture overlap.
- **Units toggle** — imperial (`12′ 6″`, fractions accepted) ⇄ metric (`3.81 m`, `45 cm`),
  instant and display-only; all geometry is stored in millimeters.
- **Grid, snapping, rulers** — configurable grid spacing, snap-to-grid (hold Alt to invert
  momentarily), furniture edge snapping to walls, top/left rulers, live cursor coordinates.
- **Tape measure** (`M`) — drag or click two points to read a distance.
- **3D view** (`3` or the 2D/3D toolbar toggle) — the same layout rendered in perspective
  by a built-in software renderer (still zero dependencies, still offline). Walls are
  extruded to a configurable height (Settings → "Wall height", default 8 ft) with real
  door and window cutouts — windows get a translucent glass pane and a sill, doors a
  lintel — and walls between the camera and the room are ghosted so the interior stays
  visible. Furniture renders as extruded shapes in its plan color; every piece has an
  editable "Height (3D)" (sensible defaults per kind: beds low, wardrobes tall, rugs
  flat), and doors/windows have editable height / sill height. Controls: drag to orbit,
  wheel to zoom, right- or middle-drag (or Space-drag) to pan, double-click or Fit to
  re-center, PNG button exports a snapshot of the current 3D view. Editing stays in 2D —
  any tool key or palette click switches back.
- **Persistence** — auto-save to `localStorage`, named layouts (save / load / rename /
  delete), JSON export/import for backup, PNG export (current view or whole layout at a
  chosen scale, with/without grid and dimensions), and undo/redo (Ctrl+Z / Ctrl+Shift+Z).
  "New" clears the canvas immediately (no dialog) — Ctrl+Z restores the previous layout.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `V` `H` `W` `D` `N` `R` `C` `M` | Select · Pan · Wall · Door · Window · Box · Circle · Measure |
| `3` | Toggle 2D / 3D view |
| `Ctrl+Z` / `Ctrl+Shift+Z` | Undo / redo |
| `Ctrl+D` | Duplicate selection |
| `Ctrl+S` / `Ctrl+E` | Save layout / export PNG |
| `Del` / `Backspace` | Delete selection |
| Arrows (+`Shift`) | Nudge selection (larger step) |
| `Space`-drag / middle-drag / `H` tool | Pan |
| Mouse wheel | Zoom at cursor |
| `Shift` | Constrain wall angle / movement axis / aspect ratio; 15° rotation steps |
| `Alt` | Momentarily invert snap |
| `Esc` | Cancel drawing / placement / measurement, or deselect |
