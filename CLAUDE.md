# valderas.be

Personal portfolio site for Inti Valderas Caro. Built by Claude Code, designed & directed by Inti.

## Architecture

```
valderas.be/
├── src/                        # 11ty input
│   ├── _includes/              # Shared partials (Nunjucks)
│   │   ├── head.njk            # <head>: meta, title (from front matter), favicons, CSS
│   │   ├── sidebar.njk         # Sidebar nav, settings panel, copyright
│   │   ├── consent-banner.njk  # GDPR cookie consent dialog
│   │   ├── cursor.njk          # Custom cursor divs
│   │   └── scripts.njk         # All <script> tags
│   ├── _layouts/
│   │   ├── base.njk            # HTML shell: head, sidebar, main-content, consent, cursor, scripts
│   │   ├── home.njk            # Extends base — skip link, particles, noise, draw/sticker canvas
│   │   └── article.njk         # Extends base — skip link targeting #content, inline pageStyles
│   ├── index.njk               # Home → home layout
│   ├── accessibility.njk       # Accessibility statement → article layout (permalink: /accessibility/)
│   ├── blog/
│   │   └── designing-with-ai.njk  # → article layout (permalink: /blog/designing-with-ai/)
│   └── portfolio/
├── assets/                     # Passthrough copy (untouched by 11ty)
│   ├── css/                    # Partials imported by style.css
│   ├── js/                     # Vanilla JS modules (window.initX pattern)
│   └── img/
├── eleventy.config.js          # 11ty config (passthrough, dirs)
├── package.json                # Scripts: build, start
├── .github/workflows/deploy.yml
├── CNAME, favicons, site.webmanifest  # Passthrough
└── _site/                      # Build output (gitignored)
```

## Key Conventions

- **Static site generator**: Eleventy (11ty) v3 with Nunjucks templates. Input: `src/`, output: `_site/`. Config: `eleventy.config.js`
- **GDPR cookie consent**: Handled via `consent-banner.njk` include + `consent.js`. Analytics (Zoho PageSense) only loads after explicit consent
- **Vanilla JS**: No frontend frameworks. Each feature in `assets/js/`, exposes `window.initFeatureName`, orchestrated from `main.js`
- **Asset paths**: All root-relative (`/assets/css/style.css`) — no `../` needed
- **Page front matter**: `title`, `layout`, optional `description`, `pageStyles` (inline CSS), `permalink`
- **Deployment**: GitHub Actions → `npm ci` → `npx eleventy` → deploy `_site/` to GitHub Pages
- **Design language**: B&W, mono labels (`var(--font-mono)`), sans body (`var(--font-sans)`), dark mode via `body.dark-mode`
- **Repo**: `github.com/intivalderas/valderas.be`, custom domain `valderas.be`
