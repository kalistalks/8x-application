#!/usr/bin/env node
/*
 * capture-agent-log.js
 * ---------------------
 * Automatic prompt/response capture for the Kiro IDE, wired to the `Stop`
 * agent hook (fires at the end of every agent turn). See .kiro/hooks/agent-capture.json.
 *
 * On stdin it receives the hook envelope JSON, which includes `session_id` and `cwd`.
 * It does NOT rely on any undocumented "final response" field on stdin. Instead it
 * reads Kiro's own session transcript (~/.kiro/sessions/<hash>/sess_<id>/messages.jsonl),
 * which is the authoritative record of the turn, and extracts:
 *   - each user prompt (payload.type === "user"), verbatim and in full
 *   - the final response for that turn: the concatenation of the visible assistant
 *     prose chunks (payload.type === "assistant" && payload.operationType === "Say").
 *
 * Deliberately EXCLUDED, per the assignment:
 *   - reasoning/thinking (operationType === "Reasoning")
 *   - tool calls and tool results
 *   - pending/resolved interactions, session_metadata, sub-agent bookkeeping
 *
 * The whole per-session log file is rewritten from the transcript on every turn, so
 * it is always complete and correctly ordered. Entries are never truncated or tidied.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

function readStdin() {
  return new Promise((resolve) => {
    let raw = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (c) => (raw += c));
    process.stdin.on("end", () => resolve(raw));
    // If nothing is piped, don't hang forever.
    setTimeout(() => resolve(raw), 2000);
  });
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

// Find the transcript directory for a given session id under ~/.kiro/sessions.
function findSessionDir(sessionId) {
  const root = path.join(os.homedir(), ".kiro", "sessions");
  if (!fs.existsSync(root)) return null;
  const wanted = "sess_" + sessionId;
  for (const hash of fs.readdirSync(root)) {
    const dir = path.join(root, hash, wanted);
    if (fs.existsSync(path.join(dir, "messages.jsonl"))) return dir;
  }
  // Fallback: sessionId may already be prefixed, or match a bare folder name.
  for (const hash of fs.readdirSync(root)) {
    const base = path.join(root, hash);
    if (!fs.statSync(base).isDirectory()) continue;
    for (const sub of fs.readdirSync(base)) {
      if (sub === sessionId || sub === wanted) {
        const dir = path.join(base, sub);
        if (fs.existsSync(path.join(dir, "messages.jsonl"))) return dir;
      }
    }
  }
  return null;
}

function readJsonl(file) {
  return fs
    .readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0)
    .map(safeParse)
    .filter(Boolean);
}

// Turn the transcript into an ordered list of exchanges.
// Each user message opens a turn; the assistant "Say" chunks that follow, up to the
// next user message, form that turn's final response.
function buildExchanges(records) {
  const exchanges = [];
  let current = null;

  for (const rec of records) {
    const p = rec.payload || {};
    const ts = rec.timestamp || null;

    if (p.type === "user") {
      if (current) exchanges.push(current);
      current = {
        promptTime: ts,
        prompt: typeof p.content === "string" ? p.content : "",
        images: Array.isArray(p.images) ? p.images.length : 0,
        documents: Array.isArray(p.documents) ? p.documents.length : 0,
        responseChunks: [],
        responseTime: null,
        model: null,
      };
    } else if (p.type === "assistant" && p.operationType === "Say" && current) {
      if (typeof p.content === "string" && p.content.length) {
        current.responseChunks.push(p.content);
        current.responseTime = ts;
      }
    }

    // Capture whichever model id the transcript exposes for this turn.
    if (current && !current.model) {
      current.model = p.reasoningModelId || p.modelId || null;
    }
  }
  if (current) exchanges.push(current);
  return exchanges;
}

function frontMatter(meta) {
  return [
    "---",
    `session_id: ${meta.sessionId}`,
    `date: ${meta.date}`,
    `author: ${meta.author}`,
    `model: ${meta.model}`,
    `tool: ${meta.tool}`,
    `project: ${meta.project}`,
    `total_exchanges: ${meta.totalExchanges}`,
    `first_prompt_time: ${meta.firstPromptTime}`,
    `last_prompt_time: ${meta.lastPromptTime}`,
    "---",
    "",
  ].join("\n");
}

function renderLog(sessionId, exchanges, sessionMeta) {
  const shortId = sessionId.split("-")[0];
  const author = process.env.AGENT_LOG_AUTHOR || "kalistalks";
  const project = sessionMeta.project || "8x-application";
  const first = exchanges[0];
  const last = exchanges[exchanges.length - 1];
  const model =
    (last && last.model) || sessionMeta.modelId || "auto";
  const date = ((first && first.promptTime) || new Date().toISOString()).slice(0, 10);

  let out = frontMatter({
    sessionId,
    date,
    author,
    model,
    tool: "kiro",
    project,
    totalExchanges: exchanges.length,
    firstPromptTime: (first && first.promptTime) || "",
    lastPromptTime: (last && last.promptTime) || "",
  });

  out += `# Session Log - ${date}\n\n`;
  out += `Session: \`${shortId}\` | Project: \`${project}\` | Author: \`${author}\`\n\n---\n\n`;

  exchanges.forEach((ex, idx) => {
    const num = idx + 1;
    const pModel = ex.model || model;
    let attach = "";
    if (ex.images || ex.documents) {
      attach = ` (attachments: ${ex.images} image(s), ${ex.documents} document(s))`;
    }
    out += `[LOG_ENTRY type=PROMPT num=${num} session=${shortId}]\n`;
    out += `timestamp: ${ex.promptTime || ""}\n`;
    out += `model: ${pModel}${attach}\n\n`;
    out += `${ex.prompt}\n\n`;

    out += `[LOG_ENTRY type=RESPONSE num=${num} session=${shortId}]\n`;
    out += `timestamp: ${ex.responseTime || ex.promptTime || ""}\n`;
    out += `model: ${pModel}\n\n`;
    out += `${ex.responseChunks.join("\n\n")}\n\n`;
  });

  return out;
}

function loadSessionMeta(sessionDir) {
  const f = path.join(sessionDir, "session.json");
  if (!fs.existsSync(f)) return {};
  const j = safeParse(fs.readFileSync(f, "utf8")) || {};
  let project = "8x-application";
  if (Array.isArray(j.workspacePaths) && j.workspacePaths[0]) {
    project = path.basename(j.workspacePaths[0]);
  }
  return { modelId: j.modelId, project };
}

function firstPromptStamp(exchanges) {
  const t = (exchanges[0] && exchanges[0].promptTime) || new Date().toISOString();
  return t.replace(/[:.]/g, "-").replace("T", "_").replace("Z", "").slice(0, 19);
}

async function main() {
  const raw = await readStdin();
  const env = safeParse(raw) || {};
  const sessionId = env.session_id || env.sessionId || process.env.KIRO_SESSION_ID;

  // The repo root: prefer cwd from the hook, else this script's parent.
  const repoRoot = env.cwd && fs.existsSync(env.cwd)
    ? env.cwd
    : path.resolve(__dirname, "..");

  if (!sessionId) {
    process.stderr.write("capture-agent-log: no session_id on stdin; nothing to do.\n");
    process.exit(0);
  }

  const sessionDir = findSessionDir(sessionId);
  if (!sessionDir) {
    process.stderr.write(`capture-agent-log: transcript not found for ${sessionId}.\n`);
    process.exit(0);
  }

  const records = readJsonl(path.join(sessionDir, "messages.jsonl"));
  const exchanges = buildExchanges(records).filter((e) => e.prompt.trim().length > 0);
  if (exchanges.length === 0) process.exit(0);

  const sessionMeta = loadSessionMeta(sessionDir);
  const logDir = path.join(repoRoot, ".agent-logs");
  fs.mkdirSync(logDir, { recursive: true });

  const fileName = `${firstPromptStamp(exchanges)}_${sessionId.split("-")[0]}.md`;
  const filePath = path.join(logDir, fileName);
  fs.writeFileSync(filePath, renderLog(sessionId, exchanges, sessionMeta), "utf8");

  process.exit(0);
}

main();
