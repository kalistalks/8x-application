# Walkthrough Script — Higgsfield Camera Sequencer

**Target length:** under 5 minutes. Timings are cues, not hard limits.
Speak to the *why* first, then let the sequence interaction carry the demo.

---

## 0:00 – 0:40 · The problem (why this feature)

> "Higgsfield's camera-move feature has a contradiction built into it. Their own
> modal says 'Several per shot — order matters.' But the actual mechanism just
> dumps camera-move text tokens into the subject prompt box, next to your scene
> description.
>
> A text box has no concept of order. You can't see where one move ends and the
> next begins, reordering means cutting and pasting text, and the camera
> directions get tangled up with what the shot is actually of.
>
> So I picked this one flaw and rebuilt it — not the whole platform. The bet is
> simple: camera choreography should be *visible, ordered, and directly editable*,
> not hidden inside a prompt string."

**Why this feature:** it's the highest-leverage fix. It's a genuine UX problem in
the real product, it's self-contained enough to polish in a take-home, and it has
one clearly novel interaction to build well rather than ten shallow ones.

---

## 0:40 – 1:00 · The shell and the shape of it

> "The whole thing is one continuous workspace, not separate pages. Same
> Higgsfield shell, same width, same visual language throughout — it just changes
> state: Compose, Generating, Result. Dark, understated, one acid-green accent —
> no neon 'AI product' glow."

Point out: the compact header (brand + "Camera Sequencer" context), and that
there's deliberately no nav, billing, or account clutter.

---

## 1:00 – 1:30 · Compose — separating subject from camera

> "First, the core separation. This top field is *subject only* — what's in the
> shot. 'A cyclist crossing an empty city street at dusk.' Notice there's a
> character count, and an optional reference image you can attach right here."

Do: type a short prompt. Attach an image → thumbnail chip appears.

> "The image is honest about its role — it's decorative, it makes the flow match
> what a real user does, but it doesn't feed the mocked result. And critically:
> no camera-move text ever lands in this box."

Optional: drop an invalid file to show the inline error, then remove it.

---

## 1:30 – 2:45 · The sequence — the heart of the submission

> "This is where I spent most of the polish time. Three explicit positions are
> always visible — even when empty they're dashed ghost slots, so you understand
> the three-move limit *before* you hit it."

Do, narrating each interaction:

1. **Add** — click a library card. "Clicking a card appends it to the next
   position — it animates in, and the card flips from a plus to a checkmark."
2. **Add two more** — "Duplicates are fine, I kept that simple."
3. **Reorder** — use the arrows. "Reordering is a click, not a copy-paste. Items
   slide to their new spots."
4. **Speed** — toggle Slow / Dynamic / Whip on a chip. "Each move has its own
   speed treatment — the pill animates between states."
5. **Remove** — hit the ×. "Removing closes the gap, the rest keep their order,
   and the freed slot reopens at the end."

> "The library cards and the sequence chips share the same card language on
> purpose — so 'click card → chip appears' reads instantly, no explanation
> needed. And when all three slots are full, the library dims to show you're
> capped."

Call out: hover a library card to show the looping preview clip and the motion glyph.

---

## 2:45 – 3:05 · Generate

> "One primary action, and only one visible at a time. Generate stays disabled
> until the scene is ready — it tells you exactly why: describe the scene, or add
> a move. There's a live summary of the queued sequence right next to it."

Do: click Generate.

---

## 3:05 – 3:40 · Generating

> "This is a state, not a page — it crossfades in. The queued sequence stays
> visible the whole time, so you never lose your place. Three status stages
> advance automatically with a progress bar, over about six or seven seconds."

Point out: the subtle scan line on the preview frame, the stage checklist
(done / active / upcoming), and:

> "Cancel brings you straight back to Compose with your prompt and sequence
> exactly as you left them — nothing is lost."

(Let it run through to Result, or cancel-and-restart to show state is preserved.)

---

## 3:40 – 4:20 · Result

> "'Your shot is ready.' The video autoplays, muted and looped, with native
> controls plus a loop toggle. On the side: the exact sequence that was used, in
> order, and the subject prompt you wrote."

Do: toggle loop, hover the download.

> "Download returns the same clip. And I'm explicit about the mock — right here:
> 'This prototype uses a bundled mock video. No generation model is connected.'
> There's no real generation, and I don't hide that. It's a deliberate scope
> decision — the assignment is about the UX, not a model integration."

Do: click **Start over** → "clears the prompt, the image, and the sequence, and
takes you back to Compose."

---

## 4:20 – 4:50 · Craft and constraints (close)

> "A few things under the surface: every interaction is keyboard accessible with
> native controls and visible accent focus rings; the status region is
> aria-live; and all the motion respects prefers-reduced-motion — it goes calm if
> the OS asks for it. It's responsive down to mobile — the sequence chips stack
> and the reorder arrows even flip to up/down.
>
> And I stayed disciplined on scope. Everything the spec listed as a non-goal —
> auth, billing, history, model selection, drag-and-drop, prompt-token previews —
> is deliberately absent. Fewer things, each one considered."

---

## 4:50 – 5:00 · One-line wrap

> "That's the whole bet: take camera moves out of the text box and make the
> sequence something you can see, order, and edit directly. Thanks for watching."

---

## Features to make sure you highlight

Ranked by importance for grading (UX is the rubric):

1. **The sequence interaction** — add / reorder / remove / speed, with snappy
   animation and the always-visible three-slot model. This is the novel piece;
   give it the most airtime.
2. **Subject/camera separation** — the actual redesign rationale. Say it out loud.
3. **Shared card language** — library cards ↔ chips look related on purpose.
4. **One continuous workspace** — states crossfade; Cancel preserves state.
5. **Honest mock disclosure** — visible, not hidden.
6. **Restraint** — dark, one accent, one primary action, no out-of-scope features.
7. **Accessibility + reduced motion + responsive** — mention briefly; don't dwell.

## Delivery tips

- Lead with the *why*. The problem framing is what makes the rebuild make sense.
- Let the sequence interactions speak — pause and actually click, don't just talk.
- Say "this is a state, not a page" at least once; it's a deliberate design choice.
- Name the mock plainly and early-ish so it never feels like you're hiding it.
- If you run long, cut the accessibility detail in the close, not the sequence demo.
