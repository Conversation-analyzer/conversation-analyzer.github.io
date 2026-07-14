## Architecture Overview

The analyzer follows a unidirectional, provider-agnostic data flow. Raw input — an uploaded file, the bundled demo, or a live OpenCode connection — is normalized into a single `ConversationSpec` model, shaped into view-specific slices, then rendered to the DOM.

```
Raw JSON / API Response / Capture
        |
        v
    Parser          --> ConversationSpec (normalized model)
        |                       ^
        |                       | capture merge
        v                       |
    Extractor       --> session, metrics, messages, tools, timeline, summary
        |
        v
    Renderer        --> DOM (Overview, Timeline, Messages, Tools, Insights)
```

### Why normalize?

Every supported backend (currently OpenCode) emits a different wire format. The **parser** is the only component that understands a specific backend's shape; everything downstream operates purely on `ConversationSpec`. Adding a provider means writing a parser (+ optional capture merger) — no changes to extractors or renderers are required.

### Capture merge

OpenCode can optionally run the `conversation-analyzer-capture` plugin, which writes `system_prompt`, `chat_params`, and `tool_call` events to `~/.local/share/conversation-analyzer/capture/capture.jsonl`. After the session is parsed into a `ConversationSpec`, the capture merger attaches that overhead data (system-prompt token estimates, chat params, richer tool args/output) onto the model — kept separate from the visible conversation thread.

### File Structure

Key files and their responsibilities (all under `frontend/`):

<div class="docs-table-wrap">
  <table class="docs-table">
    <thead>
      <tr>
        <th>File</th>
        <th>Responsibility</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>js/app.js</code></td>
        <td>Application core. Manages state, event handlers, and orchestrates the render pipeline.</td>
      </tr>
      <tr>
        <td><code>js/renderer.js</code></td>
        <td>All HTML rendering for the Overview, Timeline, Messages, Tools, and Insights tabs.</td>
      </tr>
      <tr>
        <td><code>js/grids.js</code></td>
        <td>AG Grid integration for sortable, filterable message and tool tables.</td>
      </tr>
      <tr>
        <td><code>js/charts.js</code></td>
        <td>Plotly chart rendering for the Insights tab.</td>
      </tr>
      <tr>
        <td><code>js/extractor.js</code></td>
        <td>Six extraction functions that pull specific slices from a ConversationSpec.</td>
      </tr>
      <tr>
        <td><code>js/parser/opencode_parser.js</code></td>
        <td>Converts a raw OpenCode session array into a normalized ConversationSpec.</td>
      </tr>
      <tr>
        <td><code>js/parser/parser_registry.js</code></td>
        <td>Parser lookup/registration (<code>getParser</code> / <code>registerParser</code>).</td>
      </tr>
      <tr>
        <td><code>js/parser/opencode_capture.js</code></td>
        <td>Parses and merges local capture events into a ConversationSpec.</td>
      </tr>
      <tr>
        <td><code>js/connections/</code></td>
        <td>HTTP client classes (fetch + timeout) for each supported backend.</td>
      </tr>
      <tr>
        <td><code>js/datasource/</code></td>
        <td>Data fetchers that use connections to retrieve sessions and messages.</td>
      </tr>
      <tr>
        <td><code>js/models/conversation.js</code></td>
        <td>The ConversationSpec definition (the normalized data model).</td>
      </tr>
      <tr>
        <td><code>config/</code></td>
        <td>JSON configuration for the app and each backend (<code>opencode.json</code>, <code>manifest.json</code>).</td>
      </tr>
    </tbody>
  </table>
</div>

See the [Renderer](/docs?doc=architecture/renderer) page for the presentation stage, and the [API Reference](/docs?doc=api/parser) for the Parser, Extractor, Connector, and Datasource function signatures.
