# Room Planner — Product Requirements Document

## 1. Summary

A personal, locally-hosted, top-down 2D room-layout tool. The user draws scale-accurate room outlines from scratch (including non-rectangular / L-shaped rooms), marks doors and windows on the walls, and places furniture from a built-in library or as custom-drawn shapes. Everything is measured in real-world units with a live toggle between imperial (feet/inches) and metric (meters/centimeters). Layouts can be saved, reloaded, and exported as an image.

This is a single-user tool run locally by its owner. There is no account system, no server-side logic, and no network dependency.

## 2. Goals and non-goals

**Goals**
- Draw arbitrary room shapes to scale, quickly, with a mouse.
- Get accurate dimensions on every wall so the plan reflects the real room.
- Place, move, rotate, and resize furniture and see whether it physically fits.
- Iterate on layouts and keep a few saved versions to compare.

**Non-goals (explicitly out of scope for v1)**
- 3D or perspective views.
- Photorealistic rendering or textures.
- Importing a sketch/photo as a background (the user chose draw-from-scratch).
- Multi-user, cloud sync, or accounts.
- Mobile-first design (desktop mouse-driven is the target; it should not break on a tablet, but touch is not a priority).
- Automatic layout suggestions / AI placement.

## 3. Target environment

- Runs as a single self-contained `index.html` file (inline CSS + JS) so it can be opened directly or served with any static local server. No build step, no external network calls at runtime.
- Vanilla JavaScript. Rendering via HTML5 Canvas **or** SVG — implementer's choice; Canvas is recommended for smooth pan/zoom with many objects, SVG is fine if object counts stay modest and easier hit-testing is preferred.
- Persistence via browser `localStorage` for auto-save plus explicit JSON export/import for portability and backup. (Because this is locally hosted and self-run, `localStorage` is appropriate here.)
- Works fully offline.

## 4. Coordinate system, scale, and units

- Maintain a single **canonical internal unit** (recommend: millimeters, stored as numbers). All geometry is stored in this unit regardless of display setting. Never store display strings as source of truth.
- A **units toggle** switches all displayed measurements and input fields between:
  - Imperial: feet + inches (e.g., `12' 6"`), with inch entry accepting decimals or fractions if feasible.
  - Metric: meters / centimeters (e.g., `3.81 m` or `381 cm`).
- The toggle is instant and global; it changes display only, never the underlying geometry.
- A **scale/zoom** control (buttons + mouse wheel) and **pan** (space-drag or middle-mouse-drag) let the user navigate. Show current zoom level.
- A **grid** overlay with a configurable spacing (e.g., default 6 in / 15 cm). Grid can be toggled on/off. **Snap-to-grid** is a toggle; when on, wall vertices and furniture snap to grid intersections.
- Optional **rulers** along the top and left edges showing real-world distances at the current zoom.

## 5. Functional requirements

### 5.1 Drawing the room (walls)

- **Polygon wall tool:** click to drop successive vertices; each new segment previews its live length as you move the mouse. Click the starting vertex (or press Enter) to close the loop. This supports rectangles, L-shapes, and any arbitrary polygon.
- **Straight-segment constraint:** holding a modifier (e.g., Shift) constrains the current segment to horizontal/vertical/45°.
- **Snapping while drawing:** snap to grid (if enabled) and snap to existing vertices/edges so shapes close cleanly.
- **Edit after drawing:**
  - Select and drag any vertex to reshape; adjacent segment lengths update live.
  - Insert a vertex on an existing edge (to add a jog/alcove).
  - Delete a vertex.
  - Click a wall segment to type an exact length, which moves the endpoint accordingly.
- **Wall thickness:** a settable property (default e.g. 4.5 in / 11.5 cm). Walls render as thickness, not hairlines, so doors/windows and interior area read correctly. A per-wall override is nice-to-have; a single global thickness is acceptable for v1.
- **Dimension labels:** every wall segment shows its length. Optionally show overall room bounding dimensions and total floor area (in current units).
- Support a single room per layout in v1. (Multiple disconnected rooms = future.)

### 5.2 Doors and windows

- Doors and windows are **attached to a wall segment** and slide along it; they cannot float free in space.
- Place by selecting a door/window tool, then clicking on a wall; the object attaches at the click point.
- Properties:
  - **Width** (real units, editable).
  - **Position** along the wall (drag or numeric offset from a wall end).
  - **Door swing:** direction and hinge side, drawn as the standard arc so clearances are visible. Provide a "flip" control.
  - **Window:** drawn as the standard break-in-wall / double-line symbol (no swing).
- Doors/windows re-anchor correctly if the wall is reshaped or moved. If a wall they belong to is deleted, they are removed with it (warn the user).
- Represent them visually with conventional architectural top-down symbols.

### 5.3 Furniture — library

- A built-in palette of common top-down furniture shapes, each with sensible default real-world dimensions the user can override. Suggested starter set (living-room focused, since that's the first use case, but general enough to reuse):
  - Sofa (2-seat, 3-seat), sectional, armchair, ottoman/pouf
  - Coffee table, side/end table, console table
  - TV / media unit, bookshelf
  - Rug (rectangular, round)
  - Dining table (rectangular, round), dining chair
  - Bed (twin/full/queen/king), nightstand, dresser, wardrobe
  - Desk, office chair
  - Plant, floor lamp
  - Generic rectangle, generic circle (fallbacks)
- Each library item is a labeled icon in a sidebar palette. **Drag from palette onto the canvas** (or click item then click canvas) to place.
- Each placed item is a real-scale footprint, not a fixed pixel icon, so it stays correct when zooming.

### 5.4 Furniture — custom

- **Custom rectangle** and **custom circle/ellipse** tools: draw a footprint at any size; type exact dimensions after drawing.
- **Custom polygon** (nice-to-have) for odd pieces.
- Any custom shape can be given a **label** and a **color/fill**, and can be **saved into the palette** for reuse (persisted with the library).

### 5.5 Manipulating placed objects (furniture, doors, windows)

- **Select** by click; multi-select via marquee drag and/or Shift-click.
- **Move** by dragging; arrow keys nudge selected objects by a small increment (Shift = larger).
- **Rotate:** a rotation handle plus numeric angle entry; snap to common angles (0/15/45/90°) while holding a modifier.
- **Resize:** corner/edge handles; hold modifier to preserve aspect ratio; numeric width/height entry in the properties panel.
- **Snap options:** snap furniture edges to walls and to the grid; optional snap to other furniture edges. Snapping is toggleable.
- **Overlap feedback (nice-to-have but valuable):** highlight furniture that overlaps another piece or crosses a wall, so the user can tell what actually fits. This does not block placement, just flags it.
- **Layering / z-order:** bring-to-front / send-to-back (e.g., rug under coffee table).
- **Duplicate** (Ctrl/Cmd-D), **delete** (Del/Backspace).
- **Properties panel** for the current selection: dimensions, position, rotation, label, color, and (for doors/windows) width/swing.

### 5.6 Measurement tools

- A **tape-measure tool**: click two points to read the distance between them; show it while dragging. Useful for checking clearances (e.g., walkway width) without placing an object.
- Dimensions always render in the currently selected unit system.

### 5.7 Persistence and files

- **Auto-save** the current layout to `localStorage` so reopening the page restores the last state.
- **New / Save / Save As / Load** named layouts (stored locally). A simple list of saved layouts with rename/delete.
- **Export to JSON** (download) and **Import from JSON** (upload) for backup and moving between machines.
- **Export to PNG image** of the current view (with an option to export the whole layout at a chosen scale, and to include/exclude the grid and dimension labels).
- **Undo / Redo** across drawing and editing actions (Ctrl/Cmd-Z / Shift-Ctrl/Cmd-Z). Aim for a reasonable history depth.

## 6. UI layout

- **Top toolbar:** file actions (New/Save/Load/Export), undo/redo, units toggle, grid toggle, snap toggle, zoom controls.
- **Left sidebar:** tool selector (select, wall, door, window, custom rectangle/circle, tape measure) and the furniture palette (library + saved custom items), organized in collapsible groups.
- **Center:** the drawing canvas with optional rulers and grid.
- **Right sidebar (properties panel):** context-sensitive properties for the current selection; shows room stats (overall size, floor area) when nothing is selected.
- **Status bar (optional):** current cursor coordinates in real units, current zoom, and the tape-measure readout.

## 7. Keyboard shortcuts (suggested)

- `V` select, `W` wall, `D` door, `N` window, `R` rectangle, `C` circle, `M` measure.
- `Del`/`Backspace` delete, `Ctrl/Cmd-D` duplicate.
- `Ctrl/Cmd-Z` undo, `Shift-Ctrl/Cmd-Z` redo.
- `Ctrl/Cmd-S` save, `Ctrl/Cmd-E` export image.
- Arrow keys nudge; `Shift`+arrow larger nudge.
- `Space`-drag pan; mouse wheel zoom.
- Hold `Shift` to constrain angle/aspect; hold snap-modifier to toggle snapping momentarily.

## 8. Suggested data model (JSON)

```json
{
  "version": 1,
  "name": "Living Room v3",
  "units_display": "imperial",
  "canonical_unit": "mm",
  "grid": { "spacing_mm": 152.4, "visible": true, "snap": true },
  "wall_thickness_mm": 114.3,
  "room": {
    "vertices": [ { "x": 0, "y": 0 }, { "x": 4000, "y": 0 }, { "x": 4000, "y": 3000 } ]
  },
  "openings": [
    {
      "id": "door-1",
      "type": "door",
      "wall_index": 0,
      "offset_mm": 800,
      "width_mm": 900,
      "swing": { "hinge": "left", "direction": "in" }
    },
    {
      "id": "win-1",
      "type": "window",
      "wall_index": 1,
      "offset_mm": 1200,
      "width_mm": 1500
    }
  ],
  "furniture": [
    {
      "id": "sofa-1",
      "kind": "library:sofa_3seat",
      "label": "Couch",
      "x_mm": 1500,
      "y_mm": 2600,
      "width_mm": 2100,
      "depth_mm": 900,
      "rotation_deg": 0,
      "color": "#8a8a8a",
      "z": 1
    }
  ],
  "custom_palette": []
}
```

Notes: store geometry in the canonical unit; `units_display` only affects rendering and input. `wall_index` + `offset_mm` keep openings anchored to walls through edits.

## 9. Suggested build phases

1. **Canvas foundation:** pan/zoom, grid, rulers, units toggle, coordinate readout.
2. **Wall drawing + editing:** polygon tool, snapping, vertex editing, live dimension labels, wall thickness, area calc.
3. **Furniture:** library palette, drag-to-place, move/rotate/resize, properties panel, custom shapes, layering, duplicate/delete.
4. **Doors & windows:** wall-anchored openings with swing symbols.
5. **Persistence & export:** localStorage auto-save, named layouts, JSON import/export, PNG export, undo/redo.
6. **Polish:** overlap/clearance feedback, tape measure, keyboard shortcuts, saved custom palette.

## 10. Open questions / future ideas (not required for v1)

- Multiple rooms / whole-floor plans on one canvas.
- Per-wall thickness and interior vs. exterior wall distinction.
- Labels/annotations layer (free text notes on the plan).
- Clearance zones (e.g., show the required walkway around a bed).
- Printable to-scale output (fit to paper size).
- Light/outlet/fixture symbols.
