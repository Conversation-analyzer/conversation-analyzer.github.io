## Extractors

Extract specific data slices from a ConversationSpec.

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
        <td>Token counts, cache stats, cost, and health score.</td>
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
        <td>Sorted timeline events for the event stream view.</td>
      </tr>
      <tr>
        <td><code>extractSummary(conv)</code></td>
        <td>Quick summary stats (total messages, tools used, duration).</td>
      </tr>
    </tbody>
  </table>
</div>
