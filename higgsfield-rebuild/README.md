# Higgsfield Camera Sequencer

A focused rebuild of one specific flaw in Higgsfield.ai's camera-move feature: their
modal claims camera moves are ordered ("Several per shot; order matters") but the
underlying mechanism dumps text tokens into the subject prompt, where order, timing,
and sequence have no real meaning.

**The fix:** pull camera-move selection out of the text prompt and into a visible,
ordered sequence the user builds by clicking cards. The prompt becomes
subject-description only. Order is enforced by the UI, not by hoping the user gets a
hashtag order right in a textarea.

This is a client-side prototype built for a 24-hour take-home. UI/UX quality is the
entire point — there is no backend and **no real video generation** (see
[Mocked generation](#mocked-generation) below).

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

Requires Node 18.18+ (Node 20+ recommended).

---

## The three states

The experience is one continuous workspace with three states — not three routed
pages. They crossfade rather than navigate, and the Higgsfield shell, workspace
width, and visual language stay constant throughout.

1. **Compose** — describe the scene, build an ordered camera sequence, generate.
2. **Generating** — staged status text + progress bar over ~6.6s, then auto-advances.
3. **Result** — the mocked video with native controls, loop toggle, download, and
   the sequence + prompt that were "used."

"Start over" clears the prompt, reference image, and sequence, and returns to Compose.

### Compose

- **Scene composer** — a subject-description textarea (with live character count) and
  an optional reference image attached as a compact chip. Camera-move names are never
  inserted into the prompt.
- **Reference image** — single file, click-to-browse, accepts JPG/PNG/WebP up to 10 MB.
  Invalid type/size shows a clear inline error. The image is decorative — it does not
  feed the mocked result; it exists so the flow matches what a real user would do.
- **The sequence** (the core of the submission) — always renders three explicit
  positions. Occupied slots are chips (position number, movement glyph + name, speed
  toggle, reorder controls, remove ×); empty slots are dashed ghosts. Clicking a
  library card appends to the next position. Duplicates are allowed. Max three moves.
  Add / reorder / remove all animate via Framer Motion and respect reduced-motion.
- **Move library** — a responsive grid of eight named camera moves. Each card shows a
  looping preview clip on hover, a static glyph, and a short description. When the
  sequence is full, the whole grid dims to `opacity-50` and stops adding.
- **Generate** — a single primary action with a compact summary of the queued sequence.

### Generating

Two-column layout: a preview frame with a subtle scan line on the left, staged status
(three stages, current step, progress bar + percentage, stage checklist) on the right.
Cancel returns to Compose with the prompt and sequence intact.

### Result

The mocked video (autoplaying, muted, looped, native controls) beside a sidebar with
the sequence used, the subject prompt (or "No subject description added."), a loop
toggle, a download link, start-over, and the mocked-generation disclosure.

---

## Mocked generation

There is no real video generation model. On Generate, the app runs a staged
status-text timer, then reveals one bundled local video (`public/mock.mp4`) as the
result. The same clip is what the Download button returns. The reference image and the
chosen sequence do **not** influence the output — this is a deliberate scope decision.

A plain disclosure is shown near the result actions:

> This prototype uses a bundled mock video. No generation model is connected.

---

## Tech stack

| Concern      | Choice                                             |
| ------------ | -------------------------------------------------- |
| Framework    | Next.js 16.3.6 (App Router) + React 19, TypeScript |
| Styling      | Tailwind CSS v4, shadcn-style `cn()` utility       |
| Icons        | `@phosphor-icons/react`                            |
| Motion       | Framer Motion (sequence reorder, state crossfades) |
| Video        | Native HTML5 `<video>` with native controls        |
| Deployment   | Vercel (public, zero API keys required)            |

> **Next.js version note:** the provided setup ships Next 16.3.6 (the spec text
> referenced 15). It was kept as-is to avoid breaking the bundled configuration.
> See `AGENTS.md` for details on the modified Next setup.

---

## Design direction

- Clean, dark-mode, understated — no neon/glow "AI product" clichés.
- Near-black canvas, graphite panels, fine neutral borders.
- One acid-green accent (`#c6f24e`), used for the primary action and focus states.
- Move-library cards and sequence chips share a card language so the "click card →
  chip appears" connection reads without explanation.
- One primary action visible at a time; generous spacing; centered workspace.

## Accessibility

- Native buttons, links, textarea, and video controls throughout.
- Icon-only controls have `aria-label`s; reorder controls have tooltips.
- Generating status uses `aria-live`.
- Focus states use the accent color and stay visible.
- Information is never conveyed by color alone.
- All motion respects `prefers-reduced-motion`.

---

## Deliberate scope decisions

- **Prompt is required** to enable Generate. The spec left this to the builder's
  discretion ("subject prompt can be optional or required — your call, but be
  consistent"). Requiring it is enforced consistently: Generate stays disabled with a
  specific reason until both a prompt and at least one move are present.
- **Reference image is in scope.** Single upload with type/size validation and a
  thumbnail preview; it is decorative and never feeds the mock output.
- **Middle speed is labelled "Dynamic"** (Slow / Dynamic / Whip), matching the spec's
  wording.
- **Generation time is ~6.6s**, within the Definition of Done's 6–8s window.

Everything listed under the spec's Non-Goals is intentionally absent: no auth,
billing, history/galleries, settings, model selection, drag-and-drop, keyframes,
prompt-token previews, real generation, or backend.

---

## Project structure

```
app/            layout, page, global styles, favicon
components/      workspace state machine + Compose / Generating / Result and their parts
lib/             move library data, shared types, cn() utility
public/          higgsfield_logo.png, mock.mp4, preview-poster.jpg, moves/ (clips + posters)
```
