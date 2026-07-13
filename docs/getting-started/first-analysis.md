## First Analysis

This walkthrough takes you through analyzing a conversation using the bundled demo session. By the end, you'll understand how to read each tab and what the metrics mean.

### Load the Demo Session

Click the **Load Mock Demo Session** button on the Overview tab. The app parses the JSON, extracts all data, and renders the dashboard.

### Overview Tab

The Overview tab shows four cards:

**Session Card**

- **Session ID** — unique identifier for this conversation
- **Source** — the backend that produced it (e.g. `opencode`)
- **Agent** — the AI agent name (e.g. `build`)
- **Model** — the language model used (e.g. `big-pickle`)
- **Provider** — the API provider
- **Timestamps** — when the session started and completed

**Summary Card**

- **Total Messages** — count of all messages (user + assistant)
- **Total Tools** — count of tool calls made by the assistant
- **Token Breakdown** — input, output, and reasoning token counts

**Metrics Card**

- **Cache Read / Write** — tokens served from cache vs. fresh generation
- **Cost** — estimated API cost for the session (if reported by the backend)

**Health Score**

A 0–100 score based on:

- **Tool error rate** — failed tool calls reduce the score (60% weight)
- **Reasoning share** — excessive reasoning relative to output reduces the score (40% weight)

The ring visualization shows the score with a color:

- **Healthy** (green) — score > 70
- **Degraded** (yellow) — score 40–70
- **Critical** (red) — score < 40

### Timeline Tab

The Timeline tab shows every event in chronological order:

- **Messages** (teal) — user prompts and assistant responses
- **Reasoning** (violet) — model reasoning/thinking steps
- **Tool Starts** (amber) — when a tool call begins
- **Tool Ends** (coral) — when a tool call completes

**Filter chips** at the top let you toggle visibility of each event type. Click a chip to hide or show that category.

The **token streaming sparkline** at the top shows cumulative token accumulation over time — useful for spotting spikes or unusual patterns.

### Messages Tab

Messages are grouped into **conversation turns** — a user message followed by all assistant responses until the next user message.

The AG Grid table shows:

- **Turn number** — sequential count
- **Agent** — which agent handled the turn
- **User** — preview of the user's message
- **Assistant** — preview of the assistant's response
- **Msgs** — number of messages in the turn
- **Tools** — number of tool calls in the turn
- **Tokens** — approximate token count (estimated by character count proportion)
- **Timestamp** — when the turn started

**Click any row** to open the detail panel, which shows:

- Full conversation turn with badge
- Per-turn statistics
- Token distribution pills
- All messages with role badges, latency tags, and meta tags (agent/model/provider)
- Expandable text, reasoning, and tool card sections

### Tools Tab

The Tools tab lists every tool call across the entire session.

The AG Grid table shows:

- **Tool name** — e.g. `readFile`, `writeFile`, `bash`
- **Duration** — wall-clock execution time in milliseconds
- **Input** — truncated preview of the input parameters
- **Output** — truncated preview of the output
- **Status** — `success` or `error`

**Click any row** to open the detail panel with:

- Full tool name and status badge
- Duration
- Collapsible input/output JSON (click to expand)

### Insights Tab

The Insights tab contains 7 interactive Plotly charts:

**1. Token Distribution** (donut chart)

Shows the proportion of input, output, and reasoning tokens. Helps identify if the model is spending most tokens on input context or generating output.

**2. Tool Duration** (bar chart)

Each tool call as a vertical bar. Errors are colored coral. Useful for spotting slow or failing tools.

**3. Latency Breakdown** (bar chart with percentile lines)

Per-turn response time in seconds. Includes p50 and p95 percentile reference lines with annotations. Helps identify slow turns.

**4. Timeline Gantt** (horizontal bar chart)

Tool calls plotted on a time axis — start to end. Shows parallel execution and sequential bottlenecks.

**5. Reasoning vs. Action** (stacked area chart)

Per-turn breakdown of input, output, and reasoning tokens. Shows how the model allocates effort across turns.

**6. Context Accumulation** (area chart)

Cumulative token weight across all turns. Detects acceleration — if context grows faster than 1.5x the average rate, it flags a warning. Useful for identifying context bloat.

**7. Session Comparison** (radar/polar chart)

Normalized profile across dimensions: messages, tools, input/output/reasoning tokens. Useful for comparing multiple sessions visually.

<div class="docs-callout docs-callout-tip">
  <i class="fa-solid fa-lightbulb"></i>
  <div>
    <strong>Theme Toggle</strong>
    <p>Use the sun/moon icon in the top navigation to switch between dark and light themes. All charts and grids adapt automatically.</p>
  </div>
</div>