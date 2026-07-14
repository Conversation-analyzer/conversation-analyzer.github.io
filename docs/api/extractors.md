## Extractors API

Six pure functions that take a [ConversationSpec](/docs?doc=architecture/conversation-spec) and return a single, view-ready slice. Defined in `frontend/js/extractor.js`.

```javascript
import {
    extractSession,
    extractMetrics,
    extractMessages,
    extractTools,
    extractTimeline,
    extractSummary
} from "frontend/js/extractor.js";
```

<div class="docs-table-wrap">
  <table class="docs-table">
    <thead>
      <tr>
        <th>Function</th>
        <th>Returns</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>extractSession(conv)</code></td>
        <td>Session info, assistant details, and summary stats.</td>
      </tr>
      <tr>
        <td><code>extractMetrics(conv)</code></td>
        <td>Token counts, cache stats, cost, and health score inputs.</td>
      </tr>
      <tr>
        <td><code>extractMessages(conv)</code></td>
        <td>Compiled messages grouped into conversation turns.</td>
      </tr>
      <tr>
        <td><code>extractTools(conv)</code></td>
        <td>All tool calls with input, output, status, and duration.</td>
      </tr>
      <tr>
        <td><code>extractTimeline(conv)</code></td>
        <td>Timeline events, sorted newest-first.</td>
      </tr>
      <tr>
        <td><code>extractSummary(conv)</code></td>
        <td>Quick summary stats (total messages, tools used, duration).</td>
      </tr>
    </tbody>
  </table>
</div>

All functions are null-safe (they default to empty values when the conversation or a sub-field is missing), so they can be called on partial data during live polling.
