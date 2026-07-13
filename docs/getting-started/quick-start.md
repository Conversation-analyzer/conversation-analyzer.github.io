## Quick Start

After cloning the repo, start a local HTTP server and load a conversation.

### Step 1 — Start a Server

Use any of these methods from the project root:

<div class="docs-tabs">
  <div class="docs-tab-buttons">
    <button class="docs-tab-btn active" data-tab="python">Python</button>
    <button class="docs-tab-btn" data-tab="node">Node.js</button>
    <button class="docs-tab-btn" data-tab="php">PHP</button>
  </div>
  <div class="docs-tab-panel active" data-tab-panel="python">
    <div class="docs-code-block">
      <div class="docs-code-header">
        <span class="docs-code-lang">Terminal</span>
        <button class="docs-copy-btn" data-copy><i class="fa-regular fa-copy"></i></button>
      </div>
      <pre><code>python -m http.server 8080</code></pre>
    </div>
  </div>
  <div class="docs-tab-panel" data-tab-panel="node">
    <div class="docs-code-block">
      <div class="docs-code-header">
        <span class="docs-code-lang">Terminal</span>
        <button class="docs-copy-btn" data-copy><i class="fa-regular fa-copy"></i></button>
      </div>
      <pre><code>npx serve .</code></pre>
    </div>
  </div>
  <div class="docs-tab-panel" data-tab-panel="php">
    <div class="docs-code-block">
      <div class="docs-code-header">
        <span class="docs-code-lang">Terminal</span>
        <button class="docs-copy-btn" data-copy><i class="fa-regular fa-copy"></i></button>
      </div>
      <pre><code>php -S localhost:8080</code></pre>
    </div>
  </div>
</div>

### Step 2 — Open the App

Navigate to `http://localhost:8080` in your browser. You'll see the empty state with a **Load Mock Demo Session** button.

### Step 3 — Load Data

You have three options:

**Option A — Demo Session (quickest)**

Click the **Load Mock Demo Session** button on the Overview tab. This loads a bundled ~66K-line OpenCode session so you can explore all features instantly.

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

### Step 4 — Explore

Once data is loaded, use the tab bar to switch between views:

| Tab | What You'll See |
| --- | --- |
| **Overview** | Session info, summary stats, token metrics, health score |
| **Timeline** | Chronological event stream with filter chips |
| **Messages** | Conversation turns in a sortable AG Grid table |
| **Tools** | Tool call details in a sortable AG Grid table |
| **Insights** | 7 interactive Plotly charts (tokens, latency, gantt, etc.) |

Click any row in Messages or Tools to open a detail panel with full expandable content.