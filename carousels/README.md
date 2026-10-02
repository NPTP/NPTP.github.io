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
| `poster`      | no       | **Local videos only.** Still image (in this same folder) shown instantly while `media` loads. With it, the carousel appears right away instead of waiting for the video. Make one with the command under [Posters](#posters) |
| `soundcloud`  | no       | Link to a SoundCloud track. Adds a ▶ Play button that opens a player at the bottom of the page |
| `start_offset` | no      | **Videos only.** Seconds to shift the video's loop, e.g. `1.25`. All videos play in step with the time since the page opened, so this staggers them against each other (and against GIF/WebP animations, which simply start when loaded and can't be shifted) |
| `link`        | no       | Link to play the item elsewhere (itch.io, app store, a download). Adds a Play button that opens it in a new tab. Ignored if `soundcloud` is set |

### Text length

The overlay has to fit in the square, and on phones the square is only 180px wide, so that's the limit to write for:

| Text | Ideal | Maximum |
|------|-------|---------|
| `title` | up to 20 characters (one line on desktop, two on phones) | 27 |
| `description` | 60–100 characters | 120 |
| `description` on an item with `soundcloud` or `link` (the Play button takes space) | 40–70 characters | 80 |

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

## Preparing media with ffmpeg

These are the commands used to prepare the current files. They need [ffmpeg](https://ffmpeg.org/download.html) (which includes `ffprobe`) on your PATH.
Keep the original somewhere outside the site, and write the result into the carousel folder.

### Videos

```bash
ffmpeg -ss 0:43 -to 1:13 -i original.mp4 -vf "crop='min(iw,ih)':'min(iw,ih)',scale='min(720,iw)':-2,fps=30" -c:v libx264 -preset slow -crf 28 -g 30 -keyint_min 30 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart -an carousels/games/some-name.mp4
```

What each part does, and why it matters here:

| Option | Effect |
|--------|--------|
| `-ss 0:43 -to 1:13` | Clips to that window (here 0:43–1:13). Pick the best 10–30 seconds: length is the biggest factor in file size. If the source file's name holds the window like `Game - 0-43 to 1-13.mp4`, those are the times to use. Leave both out to keep the whole video. |
| `crop='min(iw,ih)':'min(iw,ih)'` | Crops to a square from the centre, trimming the longer side equally on both ends. Works for landscape and portrait. Only the middle square is ever shown, so without this a 16:9 video downloads ~44% of pixels that get thrown away. |
| `scale='min(720,iw)':-2` | Shrinks the square to 720×720. A source already smaller than that is left at its size rather than enlarged. |
| `fps=30` | 30 frames per second. 60 fps doubles the decoding work for no visible gain in a small tile. |
| `-crf 28` | Quality (lower = better and bigger). 28 is nearly indistinguishable from 23 at tile size and about 45% smaller. Drop to 23–26 for footage with fine detail that looks smeared. |
| `-g 30 -keyint_min 30 -sc_threshold 0` | A keyframe every second. **Important:** every video jumps to its sync position on load, which means decoding from the previous keyframe. Keyframes several seconds apart made Firefox stall for seconds. |
| `-pix_fmt yuv420p` | Colour format every browser can play. |
| `-movflags +faststart` | Lets playback start before the whole file has downloaded. |
| `-an` | Drops the audio track. Carousel videos always play muted. |

If the interesting part of the video isn't in the centre, shift the crop: `crop=ih:ih:X:0` for a landscape video, where `X` is how many pixels from the left edge the square starts.

Keep the video's length the same when re-encoding, so its `start_offset` still lines up.

#### Only removing audio

If a video is otherwise fine and just has an audio track, drop it without re-encoding (no quality loss, takes a second):

```bash
ffmpeg -i some-name.webm -c:v copy -an some-name-noaudio.webm
```

Then replace the original with the new file. Works the same for `.mp4`. To check whether a file has audio, this prints nothing if it doesn't:

```bash
ffprobe -v error -select_streams a -show_entries stream=codec_name -of csv=p=0 some-name.webm
```

### Posters

A poster is one frame of the finished video, saved as a JPG next to it. Name it after the video and add `"poster": "some-name.poster.jpg"` to the JSON:

```bash
ffmpeg -ss 4 -i carousels/games/some-name.mp4 -frames:v 1 -vf "crop='min(iw,ih)':'min(iw,ih)',scale='min(720,iw)':'min(720,ih)'" -q:v 3 carousels/games/some-name.poster.jpg
```

- `-ss 4` takes the frame 4 seconds in. Pick a moment that's bright and recognisable, not a logo or a fade to black.
- Posters come out around 5–30 KB, so they load almost instantly.
- Make a new poster whenever you replace the video.

### Images

Crop to a square from the centre (trimming the longer side equally on both ends), then shrink it to 720×720 if it's bigger:

```bash
ffmpeg -i original.jpg -vf "crop='min(iw,ih)':'min(iw,ih)',scale='min(720,iw)':'min(720,ih)':flags=lanczos" -q:v 2 -frames:v 1 carousels/music/some-name.jpg
```

- Save photos and artwork as **JPG** (`-q:v 2` is high quality; 2–5 is a sensible range). They come out around 50–250 KB.
- Keep flat-colour pixel art as **PNG**: change the output name to `.png` and drop `-q:v 2`. PNG is smaller and sharper for that.
- A source smaller than 720 px on its short side stays at its own size (enlarging it would only make the file bigger, not sharper). It'll look a little soft in the largest tiles, so use a bigger source if there is one.
- Images use `'min(720,iw)':'min(720,ih)'` rather than the videos' `'min(720,iw)':-2`. The `-2` rounds to an even number, which video needs but which can leave an image one pixel off square.

### Checking a file

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,avg_frame_rate,bit_rate -of csv=p=0 some-name.mp4
```

Prints width, height, frame rate and bitrate. To list keyframe times (they should be about 1 s apart):

```bash
ffprobe -v error -select_streams v:0 -skip_frame nokey -show_entries frame=pts_time -of csv=p=0 some-name.mp4
```
