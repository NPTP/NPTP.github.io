# Carousels

Every list in `carousels.js` becomes a carousel section on the home page, in the order the lists are written, above Contact.
The list's name is both the heading and the folder its files live in:

- `games: [...]` → heading **GAMES**, files in `games/`
- `music: [...]` → heading **MUSIC**, files in `music/`

## Adding a whole new carousel

1. Create a folder, e.g. `carousels/sound_design/`.
2. Add a list to `carousels.js` with the same name: `sound_design: [ "first-item", ],`
3. The heading is the name in capitals, with `_` or `-` turned into spaces: **SOUND DESIGN**.

Scroll direction alternates automatically: the 1st carousel moves right-to-left, the 2nd left-to-right, and so on.
An empty list (or one where nothing loads) is left off the page entirely.

## The lists: `carousels.js`

`carousels.js` lists each carousel's items, one per line, in display order (first = leftmost).
Each line is the name of a JSON file in that carousel's folder, without `.json`:

```js
games: [
  "layas-horizon",
  "inheritors",
  "get-home",
],
```

Swap lines to reorder. Every line ends with a comma, including the last, so lines can be moved freely.

## One item = one JSON file

```json
{
  "title": "Laya's Horizon",
  "description": "Shown under the title when the item is hovered or tapped.",
  "media": "layas-horizon.mp4",
  "media_url": "https://example.com/some-video.mp4"
}
```

| Property      | Required | What it does |
|---------------|----------|--------------|
| `title`       | no       | Heading in the hover overlay (also the image's screen-reader text) |
| `description` | no       | Text under the title in the hover overlay |
| `media`       | no       | File name of an image or video **in this same folder** |
| `media_url`   | no       | Full link to an image or video hosted elsewhere |

| `soundcloud`  | no       | Link to a SoundCloud track. Adds a Play button that opens a player at the bottom of the page |

### Text length

The overlay has to fit in the square, and on phones the square is only 180px wide, so that's the limit to write for:

| Text | Ideal | Maximum |
|------|-------|---------|
| `title` | up to 20 characters (one line on desktop, two on phones) | 27 |
| `description` | 60–100 characters | 120 |
| `description` on a `soundcloud` item (the Play button takes space) | 40–70 characters | 80 |

The maximums assume a title of 20 characters or less; a longer title leaves less room for the description.
Past the maximum, the top of the title gets cut off on phones. Desktop squares fit roughly 3× as much, so check on a phone-sized window.

What gets shown in the square:

1. `media_url`, if present and it loads (gives up after 8 seconds)
2. otherwise `media`, if present and it loads
3. otherwise a plain grey box

## Common tasks

- **Add an item:** put the media file in the folder, create `some-name.json`, and add `"some-name",` on its own line in `carousels.js`.
- **Reorder:** move lines in `carousels.js`.
- **Hide an item without deleting it:** remove its line from `carousels.js` (or comment it out with `//`).
- **Remove an item:** remove its line from `carousels.js`, then delete its JSON and media file.
- **Add a SoundCloud track:** create a JSON with `title`, `description`, `soundcloud` (the track's page link) and, for artwork, `media_url`. To get SoundCloud's artwork, right-click the track image on SoundCloud, copy the image address, and change `-t200x200` or `-large` in it to `-t500x500`.
- **Private SoundCloud tracks:** don't add them. The whole site is public, including these JSON files, so a private track's secret link would be visible to anyone.
- If a listed name has no matching JSON, that item is skipped and a warning appears in the browser's developer console.

## Media tips

- Any size or shape works; it's cropped (never stretched) to a square.
- Ideal size is **720×720**. Videos: MP4 (H.264), 5–15 s, no audio, 30 fps, ~2–4 MB. They play muted and loop.
- Video files are recognised by extension: `.mp4`, `.webm`, `.mov`, `.ogv`. Anything else is treated as an image.
