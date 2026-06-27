// ╔══════════════════════════════════════════════════════════════╗
// ║  github-readem-animator — personal config                   ║
// ║  Fork this repo, edit this file, render, embed. Done.       ║
// ╚══════════════════════════════════════════════════════════════╝

const CONFIG = {

  // ── Identity ──────────────────────────────────────────────────
  username: 'bulkinglb',
  hostname: 'github',     // shows as  username@hostname ~ $

  // ── Terminal lines ────────────────────────────────────────────
  //   types:  cmd | out | success | error | info
  //   cmd     → white, typed char-by-char
  //   out     → white, types at 40% speed (simulates fast output)
  //   success → green
  //   error   → red
  //   info    → blue
  lines: [
    { type: 'cmd',     text: 'whoami' },
    { type: 'out',     text: 'bulkinglb — dedicated developer' },
    { type: 'cmd',     text: 'cat interests.txt' },
    { type: 'info',    text: 'open-source && challenging problems' },
    { type: 'cmd',     text: 'cat stack.txt' },
    { type: 'success', text: '> TypeScript  React  Java  Go  C++' },
    { type: 'cmd',     text: 'echo $QUOTE' },
    { type: 'success', text: '2b||!2b — that is the question' },
  ],

  // ── Intro card ────────────────────────────────────────────────
  //   name:          large heading that fades in
  //   role:          typed out beneath it
  //   nameFadeDuration:  seconds for the name fade-in
  //   roleTypingSpeed:   ms per character for the role line
  introName: 'bulkinglb',
  introRole: 'dedicated developer — open-source && challenging problems',
  nameFadeDuration: 0.9,   // seconds
  roleTypingSpeed:  60,    // ms per character

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
  typingSpeed:   55,   // ms per character (commands)
  pauseAfterLine: 800, // ms of silence before the next prompt appears

  // ── Skills ticker ─────────────────────────────────────────────
  //   scrollDuration: seconds for one full loop (lower = faster)
  //   slug: find yours at https://simpleicons.org
  //         hover any icon → the slug appears below its name
  scrollDuration: 40,

  icons: [
    { slug: 'javascript',  label: 'JavaScript'   },
    { slug: 'typescript',  label: 'TypeScript'   },
    { slug: 'java',        label: 'Java'          },
    { slug: 'cplusplus',   label: 'C++'           },
    { slug: 'csharp',      label: 'C#'            },
    { slug: 'go',          label: 'Go'            },
    { slug: 'gnubash',     label: 'Bash'          },
    { slug: 'react',       label: 'React'         },
    { slug: 'nodedotjs',   label: 'Node.js'       },
    { slug: 'fastapi',     label: 'FastAPI'       },
    { slug: 'mongodb',     label: 'MongoDB'       },
    { slug: 'postgresql',  label: 'PostgreSQL'    },
    { slug: 'solana',      label: 'Solana'        },
    { slug: 'googlecloud', label: 'Google Cloud'  },
    { slug: 'linux',       label: 'Linux'         },
  ],

};
