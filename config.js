// ╔══════════════════════════════════════════════════════════════╗
// ║  github-readem-animator — personal config                   ║
// ║  Fork this repo, edit this file, render, embed. Done.       ║
// ╚══════════════════════════════════════════════════════════════╝

const CONFIG = {

  // ── Identity ──────────────────────────────────────────────────
  username: 'GlowOnyx-d',
  hostname: 'github',     // shows as  username@hostname ~ $

  // ── Terminal lines ────────────────────────────────────────────
  //   types:  cmd | out | success | error | info
  //   cmd     → white, typed char-by-char
  //   out     → white, types at 40% speed (simulates fast output)
  //   success → green
  //   error   → red
  //   info    → blue
  lines: [
    { type: 'cmd', text: 'whoami' },
    { type: 'out', text: 'GlowOnyx-d — dedicated developer' },
    { type: 'cmd', text: 'cat interests.txt' },
    { type: 'info', text: 'being obsessed' },
    { type: 'cmd', text: 'cat stack.txt' },
    { type: 'success', text: '> TypeScript  React  Java  Go  C++' },
    { type: 'cmd', text: 'echo $QUOTE' },
    { type: 'success', text: '2b||!2b — that is the question' },
  ],

  // ── Intro card ────────────────────────────────────────────────
  //   name:          large heading that fades in
  //   role:          typed out beneath it
  //   nameFadeDuration:  seconds for the name fade-in
  //   roleTypingSpeed:   ms per character for the role line
  introName: 'GlowOnyx-d',
  introRole: 'dedicated developer — being obsessed',
  nameFadeDuration: 0.9,   // seconds
  roleTypingSpeed: 60,    // ms per character

  // ── Commit activity chart ─────────────────────────────────────
  //   Monthly commit totals aggregated across all your public repos
  //   (GitHub REST API, no auth needed — fetched at build time).
  //   months:   how many recent months to chart
  //   color:    area + line colour
  //   username: whose repos to aggregate (defaults to the username above)
  commitChart: {
    months: 12,
    color: '#7ee787',
    // username: 'someoneelse',
  },

  // ── Language donut ────────────────────────────────────────────
  //   Aggregates language bytes across all your public repos
  //   (GitHub REST API, no auth needed — fetched at build time).
  //   top:      how many languages to show (rest grouped as "Other")
  //   username: whose repos to aggregate (defaults to the username above)
  langDonut: {
    top: 6,
    // username: 'someoneelse',
  },

  // ── Terminal timing ───────────────────────────────────────────
  typingSpeed: 55,   // ms per character (commands)
  pauseAfterLine: 800, // ms of silence before the next prompt appears

  // ── Skills ticker ─────────────────────────────────────────────
  //   scrollDuration: seconds for one full loop (lower = faster)
  //   slug: find yours at https://simpleicons.org
  //         hover any icon → the slug appears below its name
  scrollDuration: 40,

  icons: [
    { slug: 'html5', label: 'HTML5' },
    { slug: 'css3', label: 'CSS3' },
    { slug: 'javascript', label: 'JavaScript' },
    { slug: 'react', label: 'React.js' },
    { slug: 'python', label: 'Python' },
    { slug: 'mysql', label: 'MySQL' },
    { slug: 'git', label: 'Git' },
    { slug: 'figma', label: 'Figma' },
  ],

};