## FAQ

<div class="docs-faq-item">
  <h4>What file formats are supported?</h4>
  <p>Currently, the analyzer supports OpenCode session JSON format. Support for Cursor, Claude Code, and generic JSON is planned on the roadmap.</p>
</div>

<div class="docs-faq-item">
  <h4>Which browsers are supported?</h4>
  <p>Chrome, Edge, Firefox, and Safari. The app uses ES modules and IntersectionObserver, which are supported in all modern browsers.</p>
</div>

<div class="docs-faq-item">
  <h4>Is there a CLI version?</h4>
  <p>No. AI Conversation Analyzer is a browser-based tool. There is no server-side component or CLI.</p>
</div>

<div class="docs-faq-item">
  <h4>How is the health score calculated?</h4>
  <p>The health score (0-100) is computed from two factors: tool error rate and reasoning share. A high error rate or very low reasoning activity lowers the score.</p>
</div>

<div class="docs-faq-item">
  <h4>Can I change the live polling interval?</h4>
  <p>Currently, the polling interval is hardcoded at 4 seconds. Configurable polling is planned for a future release.</p>
</div>

<div class="docs-faq-item">
  <h4>Does my data leave my machine?</h4>
  <p>No. The analyzer runs entirely in your browser. When using file upload, data never leaves your device. When connecting to a backend, requests go only to the host you configure.</p>
</div>
