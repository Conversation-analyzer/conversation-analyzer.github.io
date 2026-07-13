## Overview

The analyzer follows a unidirectional data flow pattern.

<div class="docs-placeholder">
  <i class="fa-solid fa-diagram-project"></i>
  <p>Data flow diagram coming soon.</p>
</div>

```
Raw JSON / API Response
        |
        v
    Parser          --> ConversationSpec (normalized model)
        |
        v
    Extractor       --> session, metrics, messages, tools, timeline, summary
        |
        v
    Renderer        --> DOM (Overview, Timeline, Messages, Tools, Insights)
```

### File Structure

Key files and their responsibilities.

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
        <td>All HTML rendering for Overview, Timeline, Messages, Tools, and Insights tabs.</td>
      </tr>
      <tr>
        <td><code>js/grids.js</code></td>
        <td>AG Grid integration for sortable, filterable message and tool tables.</td>
      </tr>
      <tr>
        <td><code>js/charts.js</code></td>
        <td>Plotly chart rendering — 7 chart types for the Insights tab.</td>
      </tr>
      <tr>
        <td><code>js/extractor.js</code></td>
        <td>Six extraction functions that pull specific slices from ConversationSpec.</td>
      </tr>
      <tr>
        <td><code>js/parser/opencode_parser.js</code></td>
        <td>Converts raw OpenCode JSON into a normalized ConversationSpec.</td>
      </tr>
      <tr>
        <td><code>js/connections/</code></td>
        <td>HTTP client classes for each supported backend.</td>
      </tr>
      <tr>
        <td><code>js/datasource/</code></td>
        <td>Data fetchers that use connections to retrieve sessions and messages.</td>
      </tr>
      <tr>
        <td><code>config/</code></td>
        <td>JSON configuration files for the app and each backend.</td>
      </tr>
    </tbody>
  </table>
</div>
