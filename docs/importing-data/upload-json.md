## Upload JSON

Load a session by uploading a JSON file exported from your AI coding assistant. This is the simplest way to get started — no backend connection required.

### How It Works

The upload handler creates a hidden file input, opens the system file picker, and reads the selected JSON file. Once parsed, the data flows through the pipeline:

```
Your JSON file → Parser → ConversationSpec → Extractors → Dashboard
```

The parser validates that the input is an array of message objects. If the file is malformed or not in a supported format, the app shows an error message and leaves the current session intact rather than failing silently.

### Step-by-Step

<ol class="docs-steps">
  <li>
    <span class="docs-step-num">1</span>
    <div>
      <strong>Click "Upload"</strong>
      <p>Find the Upload button in the top navigation bar. It's located next to the Connect button.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">2</span>
    <div>
      <strong>Select your JSON file</strong>
      <p>Choose a <code>.json</code> file in OpenCode session format. The file picker filters for JSON files only.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">3</span>
    <div>
      <strong>Explore the dashboard</strong>
      <p>The Overview, Timeline, Messages, Tools, and Insights tabs populate automatically. Start with Overview for a summary, then dive into specific tabs.</p>
    </div>
  </li>
</ol>

### What the Parser Extracts

From each message in your JSON, the parser pulls:

| Field | Description |
|-------|-------------|
| Session ID | Unique identifier from the first message |
| Agent name | Which AI agent handled the conversation |
| Model | The language model used |
| Provider | The API provider (e.g. `opencode`) |
| Timestamps | Start and completion times |
| Tokens | Input, output, reasoning, cache read/write counts |
| Cost | Estimated API cost (if reported) |
| Messages | Compiled message objects with role, parts, and metadata |
| Tools | Tool calls with name, status, input/output, duration |
| Timeline | Chronological event stream (messages, reasoning, tool starts/ends) |

### Supported Formats

Currently supported:

| Format | Status |
|--------|--------|
| OpenCode session JSON | Supported |

Planned formats will be added as new parsers are implemented. The normalized [ConversationSpec](/docs?doc=architecture/conversation-spec) model makes it easy to add support for new backends.

<div class="docs-callout docs-callout-tip">
  <i class="fa-solid fa-lightbulb"></i>
  <div>
    <strong>Tip</strong>
    <p>You can upload a new file at any time. The dashboard clears the previous session and loads the new one. No page refresh needed.</p>
  </div>
</div>

### File Size

The app handles large sessions well. The bundled demo session is about 1 MB (trimmed for shipping) and loads in under a second. Very large sessions (100K+ messages) may take a moment to parse and render, but the grid and chart libraries handle virtualization efficiently.
