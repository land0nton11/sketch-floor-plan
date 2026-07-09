# Room Planner

A personal, locally-hosted, top-down 2D room-layout tool — the v1 implementation of
[room-planner-PRD.md](room-planner-PRD.md).

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
- **Overlap feedback** — pieces that collide with other furniture or cross a wall get a red
  dashed outline (rugs are exempt from furniture overlap, so things can sit on them).
- **Units toggle** — imperial (`12′ 6″`, fractions accepted) ⇄ metric (`3.81 m`, `45 cm`),
  instant and display-only; all geometry is stored in millimeters.
- **Grid, snapping, rulers** — configurable grid spacing, snap-to-grid (hold Alt to invert
  momentarily), furniture edge snapping to walls, top/left rulers, live cursor coordinates.
- **Tape measure** (`M`) — drag or click two points to read a distance.
- **Persistence** — auto-save to `localStorage`, named layouts (save / load / rename /
  delete), JSON export/import for backup, PNG export (current view or whole layout at a
  chosen scale, with/without grid and dimensions), and undo/redo (Ctrl+Z / Ctrl+Shift+Z).

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `V` `W` `D` `N` `R` `C` `M` | Select · Wall · Door · Window · Box · Circle · Measure |
| `Ctrl+Z` / `Ctrl+Shift+Z` | Undo / redo |
| `Ctrl+D` | Duplicate selection |
| `Ctrl+S` / `Ctrl+E` | Save layout / export PNG |
| `Del` / `Backspace` | Delete selection |
| Arrows (+`Shift`) | Nudge selection (larger step) |
| `Space`-drag / middle-drag | Pan |
| Mouse wheel | Zoom at cursor |
| `Shift` | Constrain wall angle / movement axis / aspect ratio; 15° rotation steps |
| `Alt` | Momentarily invert snap |
| `Esc` | Cancel drawing / placement / measurement, or deselect |
