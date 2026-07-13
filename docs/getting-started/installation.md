## Installation

AI Conversation Analyzer has zero dependencies and no build step. You just need to clone the repo and serve it.

### Clone the Repository

```
git clone https://github.com/Conversation-analyzer/ai_conversation_analyzer.git
cd ai_conversation_analyzer
```

### Project Structure

```
ai_conversation_analyzer/
├── index.html              # Single-page entry point
├── css/
│   └── style.css           # All styles (themes, layout, components)
├── config/
│   ├── manifest.json       # List of available backend configs
│   ├── analyzer.json       # App defaults (theme, default tab)
│   ├── opencode.json       # OpenCode backend connection settings
│   └── loader.js           # Config loading utility
├── js/
│   ├── app.js              # Application bootstrap & state management
│   ├── topnav.js           # Navigation bar & tab rendering
│   ├── upload.js           # JSON file upload handler
│   ├── connect.js          # Backend connection orchestration
│   ├── connector_picker.js # Backend selection modal
│   ├── extractor.js        # Data extraction from ConversationSpec
│   ├── renderer.js         # HTML rendering for all tabs
│   ├── grids.js            # AG Grid table initialization
│   ├── charts.js           # Plotly chart rendering
│   ├── models/
│   │   └── conversation.js # ConversationSpec data model
│   ├── parser/
│   │   └── opencode_parser.js  # OpenCode JSON → ConversationSpec
│   ├── connections/
│   │   ├── manager.js      # Connection factory
│   │   └── opencode.js     # OpenCode HTTP client
│   └── datasource/
│       ├── manager.js      # DataSource factory
│       └── opencode.js     # OpenCode data fetching
└── sample/
    └── demo_session.json   # Bundled demo session
```

### No Build Required

The app uses ES modules loaded directly by the browser. There is no `package.json`, no `node_modules`, no compilation step. Just serve the directory and open it.

<div class="docs-callout docs-callout-note">
  <i class="fa-solid fa-circle-info"></i>
  <div>
    <strong>Why a local server?</strong>
    <p>ES modules (<code>import</code>/<code>export</code>) require HTTP. Opening <code>index.html</code> directly via <code>file://</code> will fail due to CORS restrictions. Any HTTP server works.</p>
  </div>
</div>