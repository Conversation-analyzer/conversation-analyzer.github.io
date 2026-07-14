## Installation

AI Conversation Analyzer ships as an npm package that bundles both the capture plugin and the dashboard server. You have three install options.

### Option A — npm (recommended)

Install globally so the `conversation-analyzer` command is available everywhere:

```bash
npm install -g ai-conversation-analyzer
```

Then run the interactive setup once (see *Registering the OpenCode plugin* below):

```bash
conversation-analyzer init
```

### Option B — npx (no install)

Run it on demand without a global install:

```bash
npx ai-conversation-analyzer
```

### Option C — From Source

```bash
git clone https://github.com/Conversation-analyzer/ai_conversation_analyzer.git
cd ai_conversation_analyzer
npm start          # equivalent to: node server.js
```

### Registering the OpenCode plugin

The analyzer works two ways: as a standalone dashboard server, or as an OpenCode plugin that captures your live sessions automatically.

**Automatic (recommended):** run `conversation-analyzer init`. It will:

1. Read the supported backends from `frontend/config/manifest.json` (currently **OpenCode**).
2. Ask permission before writing the plugin entry into your OpenCode config.
3. Add `"plugin": ["ai-conversation-analyzer"]` to `~/.config/opencode/opencode.jsonc`.

The edit is **comment-preserving** (your existing config comments and keys are kept) and **idempotent** (re-running it is a no-op if already registered).

**Manual:** add the package name to your OpenCode config yourself:

```jsonc
// ~/.config/opencode/opencode.jsonc
{
  "plugin": ["ai-conversation-analyzer"]
}
```

OpenCode launches the dashboard server automatically (default port `4474`) when the plugin loads.

### Requirements

- **Node.js 18+** (the server uses the built-in `fetch` and ESM).
- A modern browser (Chrome, Edge, Firefox, Safari).
- **OpenCode** running (for live capture / connect). The `npx`-only flow works without OpenCode if you upload a session file.

### Project Structure

The published package maps to this layout:

```
ai_conversation_analyzer/
├── index.js                 # OpenCode plugin entry (hooks + starts the server)
├── server.js                # Node server: serves the frontend, proxies the API, capture endpoint
├── setup.js                 # Interactive `init` setup (backend selection + config write)
├── capture/
│   ├── reader.js            # Reads the JSONL capture file
│   └── writer.js            # Writes capture events from plugin hooks
├── proxy/
│   └── session.js           # Proxies OpenCode's API to the dashboard
├── frontend/
│   ├── index.html           # Dashboard entry point
│   ├── config/
│   │   ├── manifest.json    # List of available backend configs
│   │   ├── analyzer.json     # App defaults (theme, default tab)
│   │   ├── opencode.json     # OpenCode backend connection settings
│   │   └── loader.js         # Config loading utility
│   ├── css/
│   │   └── style.css         # All styles (themes, layout, components)
│   ├── js/
│   │   ├── app.js            # Application bootstrap & state management
│   │   ├── topnav.js          # Navigation bar & tab rendering
│   │   ├── upload.js          # JSON file upload handler
│   │   ├── connect.js         # Backend connection orchestration
│   │   ├── connector_picker.js# Backend selection modal
│   │   ├── extractor.js       # Data extraction from ConversationSpec
│   │   ├── renderer.js        # HTML rendering for all tabs
│   │   ├── grids.js           # AG Grid table initialization
│   │   ├── charts.js          # Plotly chart rendering
│   │   ├── toast.js           # Toast notifications
│   │   ├── models/
│   │   │   └── conversation.js# ConversationSpec data model
│   │   ├── parser/
│   │   │   ├── parser_registry.js     # Multi-provider parser registry
│   │   │   ├── capture_registry.js     # Capture source registry
│   │   │   ├── opencode_parser.js      # OpenCode JSON → ConversationSpec
│   │   │   └── opencode_capture.js     # OpenCode capture event parser
│   │   ├── connections/
│   │   │   ├── manager.js      # Connection factory
│   │   │   └── opencode.js      # OpenCode HTTP client
│   │   └── datasource/
│   │       ├── manager.js      # DataSource factory
│   │       └── opencode.js      # OpenCode data fetching
│   └── sample/
│       └── demo_session.json   # Bundled demo session (~1 MB, trimmed)
├── package.json
├── README.md
└── LICENSE
```

<div class="docs-callout docs-callout-note">
  <i class="fa-solid fa-circle-info"></i>
  <div>
    <strong>No build step.</strong>
    <p>The dashboard is plain HTML/CSS/JS served by the bundled Node server — there is no <code>node_modules</code> for the frontend and no compilation step. Just run the server and open it.</p>
  </div>
</div>
