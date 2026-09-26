# Move preview assets

Drop short looping preview clips here, named to match `lib/moves.ts`:

- `tilt-up.mp4`, `pan-left.mp4`, `orbit.mp4`, `crane-up.mp4`,
  `snorricam.mp4`, `pov.mp4`, `rack-focus.mp4`, `robot-arm.mp4`

Clips may be reused across visually similar moves (per SPEC.md section 4) — they
do not need to be 8 unique files.

`posters/` holds the static idle poster for each card. The placeholder posters
here are generated SVGs; replace freely.

**Status:** placeholder posters only, no real clips yet — flagged to the user.
The move-library card falls back to the poster/glyph when a clip is missing, so
the UI renders cleanly without the MP4s.
