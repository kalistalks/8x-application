// Generates per-move poster SVGs — each shows that move's own motion diagram,
// so posters are distinct (not a generic circle). Run: node scripts/gen-posters.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "moves", "posters");
mkdirSync(outDir, { recursive: true });

// The subject box is centred at (160,74). Each glyph is the move-specific motion
// drawn around it, mirroring components/move-glyph.tsx but scaled to 320x180.
const subject = `<rect x="146" y="60" width="28" height="28" rx="3" fill="none" stroke="#c6f24e" stroke-opacity="0.35" stroke-width="1.5"/>`;

const glyphs = {
  "tilt-up": `<path d="M160 108 V40"/><path d="M148 52 L160 40 L172 52"/>`,
  "pan-left": `<path d="M210 74 H110"/><path d="M124 60 L110 74 L124 88"/>`,
  orbit: `<ellipse cx="160" cy="74" rx="52" ry="24" fill="none"/><path d="M112 62 L106 74 L118 78"/>`,
  "crane-up": `<path d="M120 112 H200"/><path d="M160 112 V38"/><path d="M146 52 L160 38 L174 52"/>`,
  snorricam: `<circle cx="160" cy="74" r="44" fill="none"/><path d="M160 30 V42 M160 106 V118 M116 74 H128 M192 74 H204" stroke-opacity="0.6"/>`,
  pov: `<path d="M96 74 L124 56 V92 Z" fill="#c6f24e" fill-opacity="0.12"/><path d="M132 74 H214"/><path d="M200 60 L214 74 L200 88"/>`,
  "rack-focus": `<circle cx="132" cy="74" r="12" fill="none"/><circle cx="196" cy="74" r="20" fill="none" stroke-opacity="0.5"/>`,
  "robot-arm": `<path d="M110 116 L146 84 L186 92 L214 44"/><circle cx="146" cy="84" r="3.5" fill="#c6f24e"/><circle cx="186" cy="92" r="3.5" fill="#c6f24e"/>`,
};

const names = {
  "tilt-up": "Tilt Up",
  "pan-left": "Pan Left",
  orbit: "Orbit",
  "crane-up": "Crane Up",
  snorricam: "Snorricam",
  pov: "POV",
  "rack-focus": "Rack Focus",
  "robot-arm": "Robot Arm",
};

for (const [id, name] of Object.entries(names)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1a1d1a"/>
      <stop offset="1" stop-color="#0f110f"/>
    </linearGradient>
  </defs>
  <rect width="320" height="180" fill="url(#g)"/>
  <rect x="0.5" y="0.5" width="319" height="179" fill="none" stroke="#2a2e2a"/>
  <g stroke="#c6f24e" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" fill="none">
    ${subject}
    ${glyphs[id]}
  </g>
  <text x="160" y="158" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#eef0ee">${name}</text>
</svg>`;
  writeFileSync(join(outDir, `${id}.svg`), svg, "utf8");
}

console.log(`Generated ${Object.keys(names).length} per-move posters in ${outDir}`);
