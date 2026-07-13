## Introduction

AI Conversation Analyzer is a browser-based dashboard for debugging, inspecting, and visualizing AI agent conversations. It ingests session JSON from AI coding assistants, normalizes it into a common data model, and presents rich analytics — token usage, tool call performance, latency, reasoning flow, and context accumulation.

Everything runs client-side. No data leaves your browser, no server-side installation is required.

<div class="docs-callout docs-callout-tip">
  <i class="fa-solid fa-lightbulb"></i>
  <div>
    <strong>Zero Build</strong>
    <p>No npm, no bundler, no compile step. Just vanilla HTML/CSS/JS served via any HTTP server.</p>
  </div>
</div>

### What You Can Do

- **Upload** a session JSON file or **connect** to a live OpenCode backend
- **Explore** conversations turn-by-turn with expandable message details
- **Inspect** every tool call — name, input, output, duration, status
- **Analyze** token distribution, latency percentiles, reasoning chains, and cost
- **Compare** sessions side-by-side with radar charts
- **Track** context accumulation across long conversations
- **Monitor** live sessions with 4-second auto-refresh polling

### Supported Backends

| Backend | Status |
| --- | --- |
| OpenCode | Supported |
| Claude Code | Planned |
| Cursor | Planned |
| Gemini CLI | Planned |
| OpenAI Agents | Planned |

### Architecture at a Glance

```
Session JSON → Parser → ConversationSpec → Extractors → Renderer/Charts
```

The app follows a clean pipeline:

1. **Parser** converts raw backend-specific JSON into the normalized [ConversationSpec](/docs?doc=architecture/conversation-spec) format
2. **Extractors** pull specific slices (session info, metrics, messages, tools, timeline) from the normalized model
3. **Renderers** generate HTML for each tab (Overview, Timeline, Messages, Tools, Insights)
4. **Charts** render interactive Plotly visualizations for the Insights tab

### Tech Stack

| Layer | Technology |
| --- | --- |
| Markup | Vanilla HTML |
| Styles | Custom CSS with CSS variables |
| Logic | Vanilla JavaScript (ES modules) |
| Data Grids | AG Grid Community v31 |
| Charts | Plotly.js v2.35 |
| Fonts | Space Grotesk, Inter, JetBrains Mono |

### Prerequisites

<ul class="docs-list">
  <li><i class="fa-solid fa-check"></i> A modern browser (Chrome, Edge, Firefox, or Safari)</li>
  <li><i class="fa-solid fa-check"></i> A local HTTP server (the app uses ES modules and cannot run from <code>file://</code>)</li>
  <li><i class="fa-solid fa-check"></i> A session JSON file in OpenCode format, or a running OpenCode instance</li>
</ul>