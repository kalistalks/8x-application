# Project Spec: Higgsfield Camera Sequencer Rebuild

## What this is

A rebuild of one specific flaw in Higgsfield.ai's camera-move feature, not the whole platform. This is a 24-hour take-home assignment. There is no real video generation — results are mocked. UI/UX quality is the entire point of this submission, since there's no backend complexity to hide behind. Build fewer things, but make each one feel considered. This is a client-side prototype with mocked generation. It does not connect to an AI model or backend.

**Do not add features not listed in this spec.** No auth, no billing, no account system, no gallery/history, no settings page, no landing/marketing page, no compiled-prompt preview drawer. If it's not inthis doc, don't build it — these were all considered and deliberately cut for scope.

## The core idea (redesign rationale)

Higgsfield's own camera-move modal says: **"Adds to the prompt box... Several per shot; order matters."** But the actual mechanism is dumping text tokens alongside the subject prompt. That contradicts their own claim — a plain text box has no concept of order, timing, or sequence. You can't tell where one move ends and the next begins, and reordering means manually cutting and pasting text.

The fix: pull camera-move selection out of the text prompt entirely and into a **visible, ordered sequence** the user builds by clicking cards. The prompt field becomes subject-description only. Order is enforced by the UI, not by hoping the user gets a hashtag order right in a textarea.

## Technical Stack
Framework: Next.js (App Router, TypeScript)

Styling: Tailwind CSS, shadcn/ui, phorsphor icons for react (@phosphor-icons/react)

Interactions & Transitions: Framer Motion (timeline item reordering and card animations)

Video Playback: HTML5 `` with custom controls

Deployment: Vercel (Public, zero API keys required)

## Product Principle
Camera choreography should be visible, ordered, and directly editable.

The interface should feel like one continuous creative workspace:

> Compose the shot → watch it process → review the result

The experience has three states, not three routed pages:

1. Compose
2. Generating
    - Indeterminate progress bar ($0 \rightarrow 100\%$) active during rendering, dynamically updating status copy according to render stages.
3. Result
    - Centered 16:9 frame displaying finished generated video
    - Native playback bar, loop toggle, timecodes, and direct MP4 download link.

Starting over clears the prompt and sequence and returns to Compose.

The Higgsfield shell, workspace width, camera-sequence language, and visual treatment remain consistent as the state changes.

## Goals
- Separate subject description from camera-direction instructions.
- Make sequence order visible before generation.
- Let users add, repeat, reorder, and remove camera moves without editing text.
- Communicate the three-move limit before users reach it.
- Make every state feel like part of the same workflow.
- Keep the prototype small enough to complete and polish within a take-home scope.

## Non Goals
Do not add:

- Authentication or user accounts
- Billing, credits, or subscriptions
- Generation history or galleries
- Settings pages
- Model selection
- Drag-and-drop interactions
- Editable keyframes or a 3D camera interface
- Prompt-token or compiled-prompt previews
- Real AI generation
- Backend or database infrastructure
- Multiple saved versions

## First screen: Compose

### Purpose
Help users describe the shot and build an ordered camera sequence with minimal explanation.

### Header
Display a compact Higgsfield product shell containing:

- Higgsfield brand
- Cinema Studio or Camera Sequencer context

Do not include navigation, user controls, credits, billing, or unrelated product features.


### 1. Image upload
 
- Single image upload, drag-and-drop or click-to-browse, one file only
- Basic type/size validation (accept jpg/png/webp, reject anything else with a clear inline message) — nothing more elaborate than that
- Once selected, show a small thumbnail preview. No cropping, no re-ordering, no multiple images
- The uploaded image does not feed into the mocked result in any way — it exists so the flow matches what a real user would actually do, not because the output reflects it
- "Start over" (see Result section) also clears this back to empty

### 2. Subject prompt

Provide one compact textarea.

Label:

> Describe your scene

Placeholder example:

> A cyclist crossing an empty city street at dusk...

Helper text:

> Describe what appears in the shot. Camera movement is controlled below.

Requirements:

- The prompt is optional.
- The field contains subject and setting information only.
- Camera-move names, hashtags, and tokens are never inserted into the prompt.
- Display a character count.

### 3. The sequence (the actual redesign — spend most of your polish time here)

- A horizontal row of ordered "chips," each showing the move name, in the order they were added
- Empty state placeholder: "Select moves below to choreograph camera timeline."
- Always show three explicit positions:
```
[ 01 Add move ] → [ 02 Add move ] → [ 03 Add move ]
```
- The moves are ordered and the sequence supports maximum of three moves
- Library cards append the moves to the sequence
- Each chip has:
  - A position number
  - A movement glphy and movement name
  - A left/right arrow (or a single "reorder" affordance) to move it earlier/later in the sequence
  - Speed toggle pill (Slow / Dynamic / Whip)
  - A small "x" on the top right corner to remove it
- The container always renders 3 slots. When a slot is unoccupied, it renders as a dashed "ghost/empty slot" (+ 01 Empty, + 02 Empty, + 03 Empty) with a subtle helper label above or below the row.
- When 3 moves are active, dim the Move Library cards to opacity-50
- Icon-only controls include accessible names and tooltips.
- Items affected by a reordering receive a brief directional transition.
- Removing an item closes the gap.
- Remaining items retain their relative order.
- The newly available empty position appears at the end.
- This component is the core UX bet of the whole submission. It should feel immediate and obvious — clicking, reordering, and removing should all have clear, snappy visual feedback (a brief transition/highlight is enough, nothing elaborate)

### 4. Move library (grid of cards)

- Grid of cards showing thumbnail previews that loop on hover.
- 6-8 cards, each a named camera move (e.g. Tilt Up, Pan Left, Orbit, Crane Up, Snorricam, POV, Rack Focus, Robot Arm — pick names from what I saw in Higgsfield's actual modal)
- Each card shows a short looping preview clip of that motion on a sample subject (bundle a handful of short stock/sample clips locally — reuse the same asset across a couple of visually similar moves if needed, it doesn't need to be 8 unique clips)
- Use a static poster when idle.
- Each card also has a simple line-based movement glyph to allow users to understand the camera motion
- Cards also include a short description below:
- Example descriptions:
  - Tilt Up — Reveal from low to high
  - Pan Left — Sweep across the scene
  - Orbit — Circle around the subject
  - Crane Up — Rise into a wide reveal
- Clicking a card appends it to the sequence below. Duplicates are fine, keep it simple — don't build logic to prevent re-adding the same move

### 5. Generate

- Single primary "Generate" button, disabled until at least 1 move is in the sequence (subject prompt can be optional or required — your call, but be consistent)
- Show a compact text summary of the queued sequence near the button.
- Clicking Generate immediately enters the Generating state.

## Second screen: Generate

### Purpose
Confirm that the selected sequence is being processed and provide clear progress without exposing fake technical complexity.

### 6. Generating state

- Staged status text over ~4-4.5 seconds, 3 short lines (e.g. "Compiling sequence...", "Applying camera choreography...", "Rendering...")
- Cancel button returns user to the Compose screen with their prompt and sequence in place 
- Auto-advances to result
- Show current step number.
- Show active, completed, and upcoming stages.
- Show a progress bar and approximate percentage.

### Third screen: Result

### 7. Result
- Display: Your shot is ready.
- Autoplaying, muted, looped video with inline playback and native playback controls (a single pre-picked stock clip is fine — it does not need to reflect the actual chosen sequence)
- Show the sequence that was "used" as text underneath, for context (e.g. "Sequence: Tilt Up -> Pan Left")
- Download button that downloads that same bundled clip
- Show the subject prompt used.
- When empty, display: No subject description added.
- "Start over" resets subject prompt + sequence back to empty and returns to the compose view

## Mocked generation (explicit, not hidden)

There is no real video generation model. On clicking Generate: run the staged status-text timer, then reveal one pre-selected local video file as the result. State this plainly in the README and in the walkthrough — it's a deliberate scope decision.
Display a plain disclosure near the actions:
> This prototype uses a bundled mock video. No generation model is connected.
Do not obscure the disclosure or imply that real AI generation occurred.

## Design direction

- Clean, dark-mode, understated — avoid neon/glow "AI product" clichés
- The move-library cards and the sequence chips should look visually related (same card language, different state) so the connection between "click card" -> "chip appears" reads clearly without needing an explanation
- One accent color, generous spacing, one primary action visible at a time
- Prioritize the sequence-chip interactions (add/reorder/remove) looking and feeling polished over anything else in the build — this is graded on UX and it's the one genuinely novel piece
- The product should feel consistent with Higgsfield's current Cinema Studio:
  - Near-black application canvas
  - Graphite controls and panels
  - One acid-green accent
  - Compact rounded surfaces
  - Fine neutral borders
  - Bold but restrained typography
  - Centered creative workspace

## Motion and feedback

Use motion only to clarify state changes:

- New sequence item enters over approximately 200–250 ms.
- Reordered items move in opposite directions.
- Added card briefly changes from `+` to a checkmark.
- Screen states crossfade rather than appearing as route changes.
- The generating scan remains subtle.

All animations must respect `prefers-reduced-motion`.

## Accessibility

- All interactions are keyboard accessible.
- Use native buttons, links, textarea, and video controls.
- Icon-only controls have `aria-label` text.
- Reorder controls provide tooltips.
- Focus states use the product accent and remain clearly visible.
- Disabled controls remain understandable.
- Generating status uses `aria-live`.
- Information is not communicated by color alone.
- Text and controls meet accessible contrast expectations.

## Definition of done

### Compose

- [ ] Prompt never receives camera-move text.
- [ ] Image upload accepts a real file and shows a thumbnail preview
- [ ] Invalid file types/sizes show a clear inline error, not a silent failure
- [ ] All three sequence positions are visible before selection.
- [ ] Clicking a card appends the move to the next position.
- [ ] Duplicate moves can be added.
- [ ] A maximum of three moves can be selected.
- [ ] Every selected move can be reordered and removed.
- [ ] Reordering preserves a contiguous sequence.
- [ ] Generate is disabled with no moves.
- [ ] Generate is enabled with one or more moves.

### Generating

- [ ] Generating appears immediately after Generate is clicked.
- [ ] The selected sequence remains visible.
- [ ] Three statuses advance automatically.
- [ ] Progress completes in approximately 6–8 seconds.
- [ ] Cancel control appears and when click brings the user back to Compose with their previously selected options.
- [ ] Result appears automatically.

### Result

- [ ] Local video autoplays muted and loops.
- [ ] The selected sequence is shown in order.
- [ ] The subject prompt is shown.
- [ ] Download returns the displayed local video.
- [ ] Start over clears prompt and sequence.
- [ ] The mocked-generation disclosure is visible.

### Quality

- [ ] Production build succeeds.
- [ ] Layout is usable on desktop, tablet, and mobile.
- [ ] All controls are keyboard accessible.
- [ ] Reduced-motion preferences are respected.
- [ ] No out-of-scope features are present.
- [ ] Responsive down to mobile width, no broken layout
- [ ] Deployed on Vercel, verified in an incognito window