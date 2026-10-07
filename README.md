# tinkeshwar.com

My personal portfolio — a single-page site that boots like a machine and behaves like a terminal. Built with React + Vite, deployed as a static site on Cloudflare Pages.

## Concept

A fake-but-functional terminal OS. The page runs a short BIOS-style boot sequence, then drops you into a shell: a `whoami` hero with a terminal-framed photo, clickable `./section` commands that stream their output BIOS-style, and a live interactive terminal you can actually type into.

## Features

- **Boot sequence** — animated BIOS/POST log on load, skippable with any key or click.
- **Terminal shell** — macOS-style title bar, scanline + CRT glow, phosphor-green palette.
- **Command bar** — `./skills`, `./projects`, `./approach`, `./about`, `./contact` stream their output one line at a time; newest output is prepended to the feed.
- **Live interactive terminal** — type real commands (`help`, `skills`, `projects`, `whoami`, `date`, `echo`, `clear`, …) with command history (↑/↓). Fills the remaining viewport height.
- **Snake game** — type `snake` to play. Each bite grows the snake; speed ramps up every 5 bites; hitting a wall or itself ends the game. Arrow keys to steer, `esc` to quit.
- **Contact icons** — real GitHub / LinkedIn / email SVG brand marks, styled in phosphor-green.
- **Responsive** — on mobile the photo moves above the bio and scales to the screen.
- **SEO** — Open Graph, Twitter card, canonical, JSON-LD (`Person` + `WebSite`), `robots.txt`, `sitemap.xml`, and a `<noscript>` fallback.
- **Accessibility** — honors `prefers-reduced-motion`, keyboard-focusable controls with visible focus rings.

## Tech stack

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- Plain CSS (custom properties for theming) — no CSS framework
- [Cloudflare Pages](https://pages.cloudflare.com/) for hosting

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build -> dist/
npm run preview  # preview the production build locally
```

## Project structure

```
.
├── index.html                 # HTML shell + all SEO meta / JSON-LD
├── public/                    # static assets copied to the site root
│   ├── favicon.svg
│   ├── terminal-me.jpeg       # profile photo used in the hero
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── main.jsx               # React entry
│   ├── App.jsx                # mounts the boot sequence + shell
│   ├── data.js                # all site content (bio, skills, projects, hints, …)
│   ├── index.css              # all styles
│   └── components/
│       ├── BootSequence.jsx   # BIOS-style boot log
│       ├── Shell.jsx          # terminal shell layout + command feed
│       ├── Topbar.jsx         # title bar
│       ├── Whoami.jsx         # hero / identity block
│       ├── PhotoFrame.jsx     # terminal-framed profile photo
│       ├── CommandBar.jsx     # ./section buttons
│       ├── CommandOutput.jsx  # streamed section output
│       ├── LiveTerminal.jsx   # interactive type-in terminal
│       ├── SnakeGame.jsx      # the `snake` command
│       └── Icons.jsx          # GitHub / LinkedIn / email SVG icons
└── mockups/                   # standalone HTML design explorations
```

## Editing content

Almost everything is data-driven. Edit `src/data.js` to change the bio, subtitle,
skills, projects, approach, contact links, boot lines, or the rotating sarcastic
footer hints — no component changes needed.

To swap the profile photo, replace `public/terminal-me.jpeg` (the frame falls back
to an ASCII portrait if the image is missing).

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and deploys `dist/` to Cloudflare Pages via `wrangler`. The workflow needs two
repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## License

Personal project — all rights reserved.
