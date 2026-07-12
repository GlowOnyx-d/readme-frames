#!/usr/bin/env node
// ──────────────────────────────────────────────────────────────────────────
//  fetch-commit-data.js
//
//  Aggregates monthly commit totals across all of a user's public (non-fork)
//  repos and writes them to compositions/commit-chart/data.js as
//  `window.__COMMIT_DATA = { months: [...], values: [...], total: N }`.
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
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'readme-frames' };
if (token) headers.Authorization = `Bearer ${token}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// config.js declares `const CONFIG = {...}` with no module exports — wrap it in
// a function and eval to pull the object out without a build system.
function loadConfig() {
  const src = fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8');
  // eslint-disable-next-line no-eval
  return eval(`(function () { ${src}; return CONFIG; })()`);
}

function writeData(data) {
  fs.writeFileSync(OUT, `window.__COMMIT_DATA = ${JSON.stringify(data)};\n`);
}

// All public, non-fork repos owned by the user (paginated, most-recently pushed first).
async function fetchRepos(user) {
  const repos = [];
  for (let page = 1; page <= 4; page++) {
    const url = `https://api.github.com/users/${user}/repos?per_page=100&page=${page}&type=owner&sort=pushed`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.log(`repo list page ${page} → ${res.status}; stopping pagination`);
      break;
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    repos.push(...batch.filter((r) => !r.fork));
    if (batch.length < 100) break;
  }
  return repos;
}

// 52 weeks of { week (unix ts), total, days[7] } for one repo. GitHub returns
// 202 with an empty body while it computes the cache — retry a few times.
async function commitActivity(fullName) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(`https://api.github.com/repos/${fullName}/stats/commit_activity`, { headers });
    if (res.status === 202) {
      await sleep(2000);
      continue;
    }
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
    return [];
  }
  return [];
}

async function main() {
  const config = loadConfig();
  const cfg = config.commitChart || {};
  const months = cfg.months || 12;
  const user = cfg.username || config.username || 'GlowOnyx-d';

  // build the last `months` calendar months as buckets (UTC for determinism)
  const now = new Date();
  const buckets = [];
  const indexByKey = new Map();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    indexByKey.set(`${d.getUTCFullYear()}-${d.getUTCMonth()}`, buckets.length);
    buckets.push({ label: MONTHS[d.getUTCMonth()], value: 0 });
  }

  let repos = [];
  try {
    repos = await fetchRepos(user);
  } catch (err) {
    console.log(`failed to list repos for @${user} (${err.message})`);
  }
  console.log(`aggregating ${repos.length} public repos for @${user}`);

  for (const repo of repos) {
    try {
      const weeks = await commitActivity(repo.full_name);
      for (const w of weeks) {
        if (!w || !Array.isArray(w.days)) continue;
        for (let d = 0; d < w.days.length; d++) {
          if (!w.days[d]) continue;
          const date = new Date((w.week + d * 86400) * 1000);
          const idx = indexByKey.get(`${date.getUTCFullYear()}-${date.getUTCMonth()}`);
          if (idx !== undefined) buckets[idx].value += w.days[d];
        }
      }
    } catch (err) {
      console.log(`skipping ${repo.full_name} (${err.message})`);
    }
  }

  const values = buckets.map((b) => b.value);
  const total = values.reduce((a, b) => a + b, 0);

  if (total > 0) {
    writeData({ months: buckets.map((b) => b.label), values, total });
    console.log(`wrote ${months} months (${total} commits) for @${user} → ${OUT}`);
  } else {
    writeData(null);
    console.log(`no commit data for @${user} — composition will use its fallback`);
  }
}

main();
