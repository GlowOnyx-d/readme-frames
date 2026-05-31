# readme-frames

Animated GIFs for GitHub profile READMEs, rendered with [HyperFrames](https://github.com/heygen-com/hyperframes).

Fork → edit one config file → render → embed. Two compositions ship out of the box.

![Skills ticker](./assets/skills-ticker.gif)

![Terminal](./assets/terminal.gif)

---

## Compositions

| File | Dimensions | What it does |
|------|-----------|--------------|
| `compositions/skills-ticker.html` | 1920 × 120 | Infinite-scrolling tech stack marquee |
| `compositions/terminal.html` | 800 × 320 | Fake terminal that types your story |

---

## Coming soon

| Idea | Dimensions | Notes |
|------|-----------|-------|
| Animated intro card | 1280 × 240 | Name fades in, role types out |
| Commit activity bar chart | 900 × 300 | Pulls from GitHub API |
| Language donut chart | 600 × 400 | Pulls from GitHub API |
| Project spotlight reel | 1280 × 480 | One slide per pinned repo |
| Live streak counter | 900 × 200 | Numbers count up from zero |
| Contribution timeline | 1280 × 200 | Horizontal dot-per-month |

PRs welcome.

---

## Quick start

**Requirements:** Node.js ≥ 22, FFmpeg

```bash
npm install -g hyperframes
```

```bash
git clone https://github.com/bulkinglb/readme-frames
cd readme-frames

hyperframes render --input compositions/skills-ticker.html --format gif --fps 30 --output assets/skills-ticker.gif
hyperframes render --input compositions/terminal.html      --format gif --fps 30 --output assets/terminal.gif
```

---

## Personalising

**Edit one file: `config.js`** — both compositions read from it automatically.

```js
const CONFIG = {

  // who you are
  username: 'yourname',
  hostname: 'github',       // shows as  yourname@github ~ $

  // terminal script — types: cmd | out | success | error | info
  lines: [
    { type: 'cmd',     text: 'whoami' },
    { type: 'out',     text: 'yourname — your role' },
    { type: 'cmd',     text: 'echo $QUOTE' },
    { type: 'success', text: 'your favourite quote' },
  ],

  typingSpeed:    55,   // ms per character
  pauseAfterLine: 800,  // ms before the next prompt appears

  // skills ticker
  scrollDuration: 40,   // seconds per loop — lower = faster

  icons: [
    { slug: 'typescript', label: 'TypeScript' },
    { slug: 'react',      label: 'React' },
    // find slugs at https://simpleicons.org
  ],
};
```

Line types and their colours:

| Type | Colour |
|------|--------|
| `cmd` | white — typed char by char |
| `out` | white — appears at 40% typing speed |
| `success` | green `#7ee787` |
| `error` | red `#f78166` |
| `info` | blue `#79c0ff` |

Icon slugs come from [Simple Icons](https://simpleicons.org) — hover any icon on that site to see the slug (e.g. `nextdotjs`, `nodedotjs`, `amazonaws`).

---

## Embedding in your profile README

After rendering, commit the GIF files to your profile repo (`username/username`) and add:

```md
![Skills](./assets/skills-ticker.gif)
![Terminal](./assets/terminal.gif)
```

---

## Automated rendering (GitHub Actions)

The included workflow (`.github/workflows/render-readme.yml`) re-renders both GIFs and commits them automatically on every push to `compositions/` — so you never run the render command manually again.

It's already configured. Just push this repo and GitHub Actions handles the rest.

---

## Credits

Built with [HyperFrames](https://github.com/heygen-com/hyperframes) by HeyGen.  
Icons from [Simple Icons](https://simpleicons.org).
