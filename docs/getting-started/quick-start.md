## Quick Start

Get the dashboard running and load your first conversation in under a minute.

### Step 1 — Install

Use any of these methods:

<div class="docs-tabs">
  <div class="docs-tab-buttons">
    <button class="docs-tab-btn active" data-tab="global">Global</button>
    <button class="docs-tab-btn" data-tab="npx">npx</button>
    <button class="docs-tab-btn" data-tab="source">From Source</button>
  </div>
  <div class="docs-tab-panel active" data-tab-panel="global">
    <div class="docs-code-block">
      <div class="docs-code-header">
        <span class="docs-code-lang">Terminal</span>
        <button class="docs-copy-btn" data-copy><i class="fa-regular fa-copy"></i></button>
      </div>
      <pre><code>npm install -g ai-conversation-analyzer</code></pre>
    </div>
  </div>
  <div class="docs-tab-panel" data-tab-panel="npx">
    <div class="docs-code-block">
      <div class="docs-code-header">
        <span class="docs-code-lang">Terminal</span>
        <button class="docs-copy-btn" data-copy><i class="fa-regular fa-copy"></i></button>
      </div>
      <pre><code>npx ai-conversation-analyzer</code></pre>
    </div>
  </div>
  <div class="docs-tab-panel" data-tab-panel="source">
    <div class="docs-code-block">
      <div class="docs-code-header">
        <span class="docs-code-lang">Terminal</span>
        <button class="docs-copy-btn" data-copy><i class="fa-regular fa-copy"></i></button>
      </div>
      <pre><code>git clone https://github.com/Conversation-analyzer/ai_conversation_analyzer.git
cd ai_conversation_analyzer
npm start</code></pre>
    </div>
  </div>
</div>

### Step 2 — Initialize (first time only)

Run the interactive setup to register the OpenCode plugin:

```bash
conversation-analyzer init
```

It lists the supported backends (currently **OpenCode**), asks for permission, and writes `"plugin": ["ai-conversation-analyzer"]` into your OpenCode config (`~/.config/opencode/opencode.jsonc`). Use `--no-setup` to skip the prompt, or `-y` to auto-confirm.

> **As an OpenCode plugin:** once registered, OpenCode starts the dashboard server automatically when it loads the plugin — no need to run the command manually.

### Step 3 — Start the dashboard

If you're not using the OpenCode plugin auto-start, launch the server yourself:

```bash
conversation-analyzer          # global install
# or
npx ai-conversation-analyzer   # no install
```

Open `http://127.0.0.1:4474` in your browser. You'll see the empty state with a **Load Mock Demo Session** button.

### Step 4 — Load Data

You have three options:

**Option A — Demo Session (quickest)**

Click the **Load Mock Demo Session** button on the Overview tab. This loads a bundled, trimmed sample session (~1 MB) so you can explore all features instantly.

**Option B — Upload a JSON File**

1. Click the **Upload** button in the top navigation bar
2. Select a `.json` file exported from OpenCode
3. The app parses and loads it immediately

**Option C — Connect to a Live Backend**

1. Make sure your OpenCode instance is running
2. Click **Connect** in the top navigation bar
3. Select your backend from the picker modal
4. Enter a session ID (or leave blank to fetch the latest session)

<div class="docs-callout docs-callout-note">
  <i class="fa-solid fa-circle-info"></i>
  <div>
    <strong>Live Polling</strong>
    <p>After connecting to a live backend, click the <strong>Live</strong> button to enable 4-second auto-refresh. The Messages, Tools, and Timeline tabs update in place without full re-renders.</p>
  </div>
</div>

### Step 5 — Explore

Once data is loaded, use the tab bar to switch between views:

| Tab | What You'll See |
| --- | --- |
| **Overview** | Session info, summary stats, token metrics, health score |
| **Timeline** | Chronological event stream with filter chips |
| **Messages** | Conversation turns in a sortable AG Grid table |
| **Tools** | Tool call details in a sortable AG Grid table |
| **Insights** | 7 interactive Plotly charts (tokens, latency, gantt, etc.) |

Click any row in Messages or Tools to open a detail panel with full expandable content.
