## Demo Session

The fastest way to explore AI Conversation Analyzer — no files, no backend, just click and go.

### What Is It

The demo session is a bundled OpenCode conversation stored at `sample/demo_session.json` inside the project. It contains a realistic coding session with:

- Multiple conversation turns (user prompts and assistant responses)
- Tool calls (file reads, writes, bash commands)
- Reasoning chains (model thinking steps)
- Token usage data (input, output, reasoning, cache)
- Timestamps and duration metrics

It's a complete, self-contained dataset that exercises every feature in the dashboard.

### How to Load It

<ol class="docs-steps">
  <li>
    <span class="docs-step-num">1</span>
    <div>
      <strong>Open the app</strong>
      <p>Navigate to <code>http://localhost:8080</code> in your browser.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">2</span>
    <div>
      <strong>Click "Load Mock Demo Session"</strong>
      <p>On the Overview tab, you'll see an empty state with a prominent button. Click it.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">3</span>
    <div>
      <strong>Explore</strong>
      <p>The app fetches the JSON file, parses it, and renders all five tabs. Start with Overview, then try each tab.</p>
    </div>
  </li>
</ol>

### What to Look For

After loading the demo, here are some things to notice:

**Overview Tab**
- The health score ring — see how tool errors and reasoning share affect it
- Token metrics — compare input vs output vs reasoning counts
- Cache stats — see how many tokens were served from cache

**Timeline Tab**
- The filter chips — toggle messages, reasoning, and tool events on/off
- The token streaming sparkline — see where tokens accumulate fastest
- Color-coded events — teal (messages), violet (reasoning), amber/coral (tools)

**Messages Tab**
- Conversation turns — each row is a user-assistant exchange
- Click a row — the detail panel shows full messages with role badges and tool cards
- Token distribution pills — see how tokens split across turns

**Tools Tab**
- Sort by duration — find the slowest tool calls
- Click a row — expand input/output JSON to see exactly what the tool received and returned
- Status badges — spot any errors quickly

**Insights Tab**
- Token Distribution donut — see the input/output/reasoning split
- Latency chart — identify slow turns with p50/p95 reference lines
- Context Accumulation — watch the cumulative token curve grow

<div class="docs-callout docs-callout-note">
  <i class="fa-solid fa-circle-info"></i>
  <div>
    <strong>About the Data</strong>
    <p>The demo session is a real OpenCode conversation that has been anonymized. Session IDs, file paths, and other identifiers have been preserved to show realistic tool call patterns.</p>
  </div>
</div>

### Resetting

To clear the demo and start fresh, just reload the page. The app returns to the empty state with the Load button.
