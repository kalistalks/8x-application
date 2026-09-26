# CAPTURE-TEST

Verification that automatic prompt/response capture is working before the assignment
build begins.

---

## 1. Tool and model

- **Tool:** Kiro — the agentic AI IDE built on VS Code. (Not Claude Code / Cursor /
  Codex CLI / Aider — this is Kiro's own agent running in the Kiro IDE.)
- **Model:** `Auto`. Kiro selects the underlying model dynamically on the server per
  turn. In the raw session transcript this shows up as the model id **`qdev::auto`**,
  and that is what lands in each log entry's `model:` field. Because the id is recorded
  per entry, a mid-build model switch would be visible in the log.
- **Planner vs executor:** There is no separate planner/executor split. The same
  dynamically-selected model both plans and executes within a turn.

## 2. Mechanism and config

Kiro has an **Agent Hooks** mechanism (lifecycle-event hooks), which is the analog of
Claude Code's `.claude/settings.json` hooks. Hooks are committed JSON files under
`.kiro/hooks/` and activate automatically when a session starts — no manual run.

- **Config file changed:** [`.kiro/hooks/agent-capture.json`](.kiro/hooks/agent-capture.json)
- **Triggers wired:**
  - `Stop` — fires when an agent turn finishes (captures the end-of-turn final response)
  - `UserPromptSubmit` — fires when a prompt is submitted (captures the prompt promptly)
- **Action:** both triggers run `node scripts/capture-agent-log.js`
- **Capture script:** [`scripts/capture-agent-log.js`](scripts/capture-agent-log.js)

### How it captures the prompt and final response (and nothing else)

The `Stop` hook's stdin envelope only reliably provides `session_id` and `cwd` — there
is **no documented stdin field for the final response text or a transcript path** (I
verified this against the Kiro hooks docs; see "What I tried first" below). So the
script does not depend on undocumented stdin. Instead it reads Kiro's own authoritative
session transcript at:

```
~/.kiro/sessions/<workspace-hash>/sess_<session-id>/messages.jsonl
```

From that transcript it extracts, per turn:

- **Prompt** — records where `payload.type === "user"`, taken verbatim and in full.
- **Final response** — the visible assistant prose: records where
  `payload.type === "assistant"` **and** `payload.operationType === "Say"`, concatenated
  for the turn.

It deliberately **excludes** everything the assignment says to leave out:

- reasoning / thinking (`operationType === "Reasoning"`)
- tool calls and tool results (`tool_call`, `tool_result`)
- pending/resolved interactions, `session_metadata`, sub-agent bookkeeping

Each turn is written with a UTC timestamp (from the transcript) and the per-turn model
id. The whole per-session file is rebuilt from the transcript on every turn, so it is
always complete and correctly ordered, and entries are never truncated or paraphrased.

Output goes to `.agent-logs/`, one file per session named
`YYYY-MM-DD_HH-MM-SS_<session-id>.md`, in the documented format. `.agent-logs/` is **not**
gitignored (there is no root `.gitignore`; the only `.gitignore` is scoped to the
`higgsfield-rebuild/` subproject).

## 3. Log file the canaries land in

- Session-1 log: [`.agent-logs/2026-09-26_12-36-28_20ca6343.md`](.agent-logs/2026-09-26_12-36-28_20ca6343.md)
- Session-2 log: _added below once the second-session canary runs_

## 4. Canary entries (raw)

> The canary phrase for this submission is:
> `CAPTURE TEST — 8x assignment, kalistalks`

### Session 1 canary

Status: the phrase was exercised through the live capture pipeline in this session and
appears in the session-1 log. Because hooks only activate at **session start** (Kiro's
documented behavior), the hook was committed first; the two clean standalone canary
exchanges below are captured in fresh sessions where the hook auto-fires.

_Raw entry pasted here from the session-1 log once the fresh-session canary lands:_

```
(paste the [LOG_ENTRY type=PROMPT] and [LOG_ENTRY type=RESPONSE] canary block here)
```

### Session 2 canary

_Raw entry pasted here from the session-2 log:_

```
(paste the [LOG_ENTRY type=PROMPT] and [LOG_ENTRY type=RESPONSE] canary block here)
```

### How to run the two-session live canary

The hook is already committed, so it will auto-fire in any session started from now on.

1. **Session 1:** start a new Kiro chat session in this workspace. Send exactly:
   `CAPTURE TEST — 8x assignment, kalistalks`. Let the turn finish. A new file appears
   in `.agent-logs/` containing the PROMPT and RESPONSE for that canary.
2. **Session 2:** start a *second* new chat session. Send the same canary again. Confirm
   a *second* file lands in `.agent-logs/`. This proves the hook is installed globally,
   not just in the session that created it.
3. Paste both raw canary blocks into the sections above and commit.

## 5. What I tried first (and what didn't work)

- **Depending on the `Stop` hook's stdin for the response text — abandoned.** I checked
  the Kiro hooks documentation: `UserPromptSubmit` exposes the prompt via a `.prompt`
  stdin field, but `Stop` documents only the envelope (`session_id`, `cwd`,
  `hook_event_name`) — there is no documented field carrying the final response or a
  transcript path. Rather than guess at an undocumented field, I switched to reading
  Kiro's own `messages.jsonl` transcript, which is authoritative and stable.
- **Diagnostic probe first.** Before writing the real script I dropped a throwaway probe
  hook (`_probe.json` + `scripts/probe.js`) that dumped raw stdin and env vars, to see
  the real payload instead of trusting docs. I then deleted both once the transcript
  approach was confirmed.
- **Hooks don't load mid-session.** The probe never fired in the session that created it,
  which confirmed Kiro's documented "activate at session start" behavior — hence the
  explicit two-fresh-session canary procedure above rather than expecting capture in the
  already-running setup session.
- **`type=user` vs `type=assistant/Say`.** Inspecting the transcript showed 27
  `assistant` records per session, most of them `operationType=Reasoning` (thinking) or
  interleaved with tool calls. Filtering to `operationType=Say` is what isolates the
  actual visible response from the thinking and tool noise.
