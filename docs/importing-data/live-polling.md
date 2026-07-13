## Live Polling

Monitor an ongoing AI conversation in real time. Live polling fetches new data from the backend every 4 seconds and updates the dashboard without a full page reload.

### How to Enable

<ol class="docs-steps">
  <li>
    <span class="docs-step-num">1</span>
    <div>
      <strong>Connect to a backend first</strong>
      <p>Use the Connect button to establish a connection to your OpenCode instance. See [Connect to OpenCode](/docs?doc=importing-data/connect-opencode) for details.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">2</span>
    <div>
      <strong>Click "Live"</strong>
      <p>The Live button is in the top navigation bar. Click it to start polling. The button highlights when active.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">3</span>
    <div>
      <strong>Watch the dashboard update</strong>
      <p>Every 4 seconds, the app fetches the latest messages from the backend and updates the relevant tabs.</p>
    </div>
  </li>
</ol>

### What Updates in Real Time

During live polling, three tabs update **in place** without full re-renders:

| Tab | Update Behavior |
|-----|----------------|
| **Messages** | New rows appended to the AG Grid, existing rows updated |
| **Tools** | New tool calls appended, existing calls updated |
| **Timeline** | New events appended to the chronological list |

The Overview and Insights tabs do **not** auto-update during live polling — they show the state from the last full load. Switch to Messages, Tools, or Timeline to see real-time changes.

### How It Works

The polling loop:

1. Calls `GET /session/{id}/message` on the backend every 4 seconds
2. Parses the response through the OpenCode parser
3. Compares with the current state
4. Updates the grid data in place (no DOM teardown)

A **token counter** (`livePollToken`) ensures stale in-flight requests don't overwrite newer data. If a previous fetch is still in flight when the next one starts, the stale response is discarded.

### Stopping Live Polling

Click the **Live** button again to stop polling. The button returns to its normal state and the interval is cleared. The dashboard retains whatever data was last fetched.

<div class="docs-callout docs-callout-warning">
  <i class="fa-solid fa-triangle-exclamation"></i>
  <div>
    <strong>Network Traffic</strong>
    <p>Live polling sends one HTTP request every 4 seconds. If your backend is on a remote server, this adds consistent network traffic. The requests are lightweight (just fetching message JSON), but be aware if you're on a metered connection.</p>
  </div>
</div>

### Polling Interval

The default interval is 4 seconds (`LIVE_POLL_MS = 4000`). This is hardcoded in `js/app.js`. To change it, modify the constant and reload the page.

A shorter interval (1–2 seconds) gives more responsive updates but increases load on the backend. A longer interval (5–10 seconds) reduces traffic but feels less real-time.

### Session Changes

If the backend starts a new session while live polling is active, the app continues polling the original session ID. To switch sessions, stop live polling, enter a new session ID, and connect again.

### Troubleshooting

| Symptom | Likely Cause |
|---------|-------------|
| Live button doesn't highlight | No backend connected — connect first |
| No new data appearing | The session may be complete (no new messages) |
| Dashboard freezes | Backend may be slow — check network and backend health |
| Stale data showing | Normal — the token counter handles this automatically; next poll will correct it |
