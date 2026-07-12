# AI Conversation Analyzer — Website

The official website and documentation for [AI Conversation Analyzer](https://conversation-analyzer.github.io/).

## Pages

| Page | Description |
|------|-------------|
| [Home](index.html) | Landing page with hero, features, how it works, screenshots, and community |
| [Features](features.html) | Detailed breakdown of every capability |
| [Docs](docs.html) | Documentation hub (currently being written) |
| [Community](community.html) | Community links, contribution guide, code of conduct |
| [Contribution](contribution.html) | Step-by-step guide for contributors |
| [Changelog](changelog.html) | Release history and upcoming changes |
| [Roadmap](roadmap.html) | Project roadmap organized by phases |
| [About](about.html) | Mission, values, and team |
| [404](404.html) | Friendly error page |

## Tech Stack

- Vanilla HTML / CSS / JavaScript
- [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) fonts
- [Font Awesome 6.7.2](https://fontawesome.com/) icons
- Zero build step, zero dependencies

## Running Locally

```bash
git clone https://github.com/Conversation-analyzer/conversation-analyzer.github.io.git
cd conversation-analyzer.github.io
python -m http.server 8080
# Open http://localhost:8080
```

## Structure

```
├── index.html          # Home / landing page
├── features.html       # Features detail page
├── docs.html           # Documentation (placeholder)
├── community.html      # Community hub
├── contribution.html   # Contribution guide
├── changelog.html      # Release history
├── roadmap.html        # Project roadmap
├── about.html          # About the project
├── 404.html            # Error page
├── css/
│   ├── tokens.css      # Design tokens (CSS variables)
│   ├── base.css        # Reset, typography, utilities
│   ├── background.css  # Background effects
│   ├── navigation.css  # Navbar styles
│   ├── components.css  # Buttons, cards, badges, tags
│   ├── layout.css      # Sections, grids, page header
│   ├── footer.css      # Footer styles
│   ├── home.css        # Hero, dashboard, features grid
│   ├── pages.css       # Docs, changelog, roadmap, about, contribution
│   ├── animations.css  # Scroll reveal, keyframes
│   └── responsive.css  # Media queries
├── js/
│   ├── config.js        # Site-wide URL configuration (GitHub links, contact)
│   ├── include.js        # Partial loader & config resolver
│   └── main.js           # Scroll reveal, counters, rotating text
├── partials/
│   ├── header.html     # Background effects + navbar (injected on load)
│   └── footer.html     # Footer section (injected on load)
└── README.md
```

## License

MIT
