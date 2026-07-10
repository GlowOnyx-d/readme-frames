#!/usr/bin/env node
// ──────────────────────────────────────────────────────────────────────────
//  fetch-language-data.js
//
//  Aggregates language byte counts across all of a user's public (non-fork)
//  repos and writes them to compositions/lang-donut/data.js as
//  `window.__LANG_DATA = [{ name, bytes }, …]` (sorted, biggest first).
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
const OUT = path.join(ROOT, 'compositions', 'lang-donut', 'data.js');

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'readme-frames' };
if (token) headers.Authorization = `Bearer ${token}`;

// config.js declares `const CONFIG = {...}` with no module exports — wrap it in
// a function and eval to pull the object out without a build system.
function loadConfig() {
  const src = fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8');
  // eslint-disable-next-line no-eval
  return eval(`(function () { ${src}; return CONFIG; })()`);
}

function writeData(data) {
  fs.writeFileSync(OUT, `window.__LANG_DATA = ${JSON.stringify(data)};\n`);
}

// All public, non-fork repos owned by the user (paginated).
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

async function main() {
  const config = loadConfig();
  const cfg = config.langDonut || {};
  const user = cfg.username || config.username || 'GlowOnyx-d';

  let repos = [];
  try {
    repos = await fetchRepos(user);
  } catch (err) {
    console.log(`failed to list repos for @${user} (${err.message})`);
  }
  console.log(`aggregating languages from ${repos.length} public repos for @${user}`);

  const totals = {};
  for (const repo of repos) {
    try {
      const res = await fetch(`https://api.github.com/repos/${repo.full_name}/languages`, { headers });
      if (!res.ok) continue;
      const langs = await res.json();
      for (const [name, bytes] of Object.entries(langs)) {
        totals[name] = (totals[name] || 0) + bytes;
      }
    } catch (err) {
      console.log(`skipping ${repo.full_name} (${err.message})`);
    }
  }

  const list = Object.entries(totals)
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes);

  if (list.length) {
    writeData(list);
    console.log(`wrote ${list.length} languages for @${user} → ${OUT}`);
  } else {
    writeData(null);
    console.log(`no language data for @${user} — composition will use its fallback`);
  }
}

main();
