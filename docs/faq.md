## FAQ

### Installation & Running

<div class="docs-faq-item">
  <h4>How do I install the analyzer?</h4>
  <p>Install it from npm: <code>npm install -g ai-conversation-analyzer</code>. You can also run it without a global install via <code>npx ai-conversation-analyzer</code>.</p>
</div>

<div class="docs-faq-item">
  <h4>Is there a CLI?</h4>
  <p>Yes. The package ships a <code>conversation-analyzer</code> binary. Running it starts the local dashboard server, and <code>conversation-analyzer init</code> runs an interactive setup that registers the OpenCode plugin for you.</p>
</div>

<div class="docs-faq-item">
  <h4>What port does the dashboard run on?</h4>
  <p>The dashboard server listens on <code>http://127.0.0.1:4474</code> by default. Open that URL in your browser after starting it.</p>
</div>

<div class="docs-faq-item">
  <h4>Is there a server-side component?</h4>
  <p>Yes — the dashboard runs as a small local server (the <code>conversation-analyzer</code> command). It serves the frontend and proxies backend API calls. No data is sent to any third party; everything stays on your machine.</p>
</div>

### OpenCode Integration

<div class="docs-faq-item">
  <h4>How do I connect it to OpenCode?</h4>
  <p>Run <code>conversation-analyzer init</code> — it detects your OpenCode config and adds the <code>ai-conversation-analyzer</code> plugin to <code>~/.config/opencode/opencode.jsonc</code>. Alternatively, connect manually from the dashboard's Connect button (see <a href="/docs?doc=importing-data/connect-opencode">Connect OpenCode</a>).</p>
</div>

<div class="docs-faq-item">
  <h4>Why can't I point the browser directly at OpenCode?</h4>
  <p>OpenCode's API listens on <code>127.0.0.1:4472</code>. The dashboard proxies <code>/api/session/*</code> to it, so the browser only ever talks to the dashboard on <code>4474</code>. This keeps a single origin and avoids CORS errors.</p>
</div>

### Data & Formats

<div class="docs-faq-item">
  <h4>What file formats are supported?</h4>
  <p>Currently the analyzer supports OpenCode session JSON (via file upload, live connect, or the bundled demo). Support for Cursor, Claude Code, and generic JSON is planned — each will be a new provider under the <a href="/docs?doc=providers/opencode">Providers</a> section.</p>
</div>

<div class="docs-faq-item">
  <h4>Does my data leave my machine?</h4>
  <p>No. The analyzer runs entirely locally. With file upload and the demo, data never leaves your device. When connecting to a backend, requests go only to the host you configure (typically <code>127.0.0.1:4472</code>).</p>
</div>

<div class="docs-faq-item">
  <h4>Do I need a backend to try it?</h4>
  <p>No. The bundled demo session loads with one click from the Overview tab (see <a href="/docs?doc=importing-data/demo-session">Demo Session</a>) and needs no OpenCode instance or file.</p>
</div>

### Features

<div class="docs-faq-item">
  <h4>How is the health score calculated?</h4>
  <p>The health score (0-100) is computed from two factors: tool error rate and reasoning share. A high error rate or very low reasoning activity lowers the score.</p>
</div>

<div class="docs-faq-item">
  <h4>Can I change the live polling interval?</h4>
  <p>Currently the polling interval is hardcoded at 4 seconds (in <code>frontend/js/app.js</code>). Configurable polling is planned for a future release.</p>
</div>

<div class="docs-faq-item">
  <h4>Which browsers are supported?</h4>
  <p>Chrome, Edge, Firefox, and Safari. The app uses ES modules and IntersectionObserver, which are supported in all modern browsers.</p>
</div>
