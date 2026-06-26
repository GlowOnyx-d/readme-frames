#!/usr/bin/env node
// ──────────────────────────────────────────────────────────────────────────
//  fetch-commit-data.js
//
//  Fetches weekly commit totals for the repo configured in config.js and writes
//  them to compositions/commit-chart/data.js as `window.__COMMIT_DATA`.
//
//  Runs at BUILD time (in CI, before rendering) so the composition stays fully
//  synchronous — HyperFrames reads a composition's timeline duration on its init
//  pass, and an in-browser `await fetch()` registers the timeline too late,
//  producing a permanent "zero duration" render failure.
//
//  No dependencies: Node 18+ ships a global `fetch`. Set GITHUB_TOKEN to lift
//  the unauthenticated rate limit (CI passes the built-in token automatically).
// ──────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'compositions', 'commit-chart', 'data.js');

// config.js declares `const CONFIG = {...}` with no module exports — wrap it in
// a function and eval to pull the object out without a build system.
function loadConfig() {
  const src = fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8');
  // eslint-disable-next-line no-eval
  return eval(`(function () { ${src}; return CONFIG; })()`);
}

function writeData(weekly) {
  fs.writeFileSync(OUT, `window.__COMMIT_DATA = ${JSON.stringify(weekly)};\n`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const { commitChart = {} } = loadConfig();
  const repo = commitChart.repo || 'bulkinglb/readme-frames';
  const weeks = commitChart.weeks || 12;

  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'readme-frames' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `https://api.github.com/repos/${repo}/stats/commit_activity`;

  // GitHub returns 202 with an empty body while it computes the stats cache —
  // retry a handful of times before giving up to the fallback.
  let weekly = null;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(url, { headers });
      if (res.status === 202) {
        console.log(`stats still computing (202) — retry ${attempt}/5`);
        await sleep(3000);
        continue;
      }
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          weekly = data.slice(-weeks).map((w) => w.total);
        }
        break;
      }
      console.log(`GitHub API responded ${res.status} — using built-in fallback`);
      break;
    } catch (err) {
      console.log(`fetch failed (${err.message}) — using built-in fallback`);
      break;
    }
  }

  if (weekly && weekly.some((n) => n > 0)) {
    writeData(weekly);
    console.log(`wrote ${weekly.length} weeks of live data for ${repo} → ${OUT}`);
  } else {
    // null signals the composition to use its deterministic fallback shape
    writeData(null);
    console.log(`no live data for ${repo} — composition will use its fallback`);
  }
}

main();
