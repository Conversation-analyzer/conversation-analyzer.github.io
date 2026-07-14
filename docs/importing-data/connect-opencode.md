## Connect to OpenCode

Connect directly to a running OpenCode instance to fetch and analyze live conversation data — no file export needed. The dashboard ships as a standalone server (the `ai-conversation-analyzer` npm package) and proxies all backend traffic for you, so CORS is a non-issue.

### Prerequisites

- OpenCode must be running and accessible (default API at `http://127.0.0.1:4472`)
- The analyzer dashboard must be running (default `http://127.0.0.1:4474`)
- No manual CORS setup is required — the dashboard proxies `/api/session/*` to OpenCode on your behalf

### How It Works

The connection flow uses a two-layer architecture inside the frontend:

```
Connector Picker → Connection (HTTP client) → DataSource (API calls) → Parser → Dashboard
```

1. **Connector Picker** — a modal that lists all configured backends from `frontend/config/manifest.json`
2. **Connection** — an HTTP client that wraps `fetch()` with timeout handling
3. **DataSource** — high-level methods for fetching sessions and messages
4. **Parser** — converts the raw response into ConversationSpec

Requests from the browser go to the dashboard (`4474`), which proxies them to OpenCode (`4472`). This keeps a single origin and avoids browser CORS blocks.

### Step-by-Step

<ol class="docs-steps">
  <li>
    <span class="docs-step-num">1</span>
    <div>
      <strong>Click "Connect"</strong>
      <p>Find the Connect button in the top navigation bar, next to Upload.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">2</span>
    <div>
      <strong>Select a backend</strong>
      <p>The connector picker modal shows all configured backends from the manifest. Each displays its label, type, and connection URL (e.g. <code>http://127.0.0.1:4472</code>).</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">3</span>
    <div>
      <strong>Enter a session ID</strong>
      <p>Type a session ID in the input field next to the Connect button. If left blank, the app fetches the most recent session automatically.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">4</span>
    <div>
      <strong>Explore the dashboard</strong>
      <p>The app fetches messages through the proxy, parses them, and renders all tabs. The session ID appears as a badge in the navigation bar.</p>
    </div>
  </li>
</ol>

### Fetching the Latest Session

If you don't know the session ID, leave the input field blank and click Connect. The app will:

1. Call `GET /api/session` (proxied to OpenCode `/session`)
2. Sort sessions by creation time (descending)
3. Pick the most recent session
4. Fetch its messages and load them

### API Endpoints Used

The dashboard proxies these OpenCode endpoints (paths are relative to the dashboard origin `4474`):

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/session` | GET | List all sessions |
| `/api/session/{id}` | GET | Get a specific session |
| `/api/session/{id}/message` | GET | Get all messages for a session |

The proxy target and route mapping are defined per-backend in `frontend/config/opencode.json` (see `apiRoutes` below). All requests include an `AbortSignal.timeout()` based on the configured timeout (default: 10 seconds).

### Configuration

Backend settings are stored in `frontend/config/opencode.json`:

```json
{
    "type": "opencode",
    "label": "OpenCode (local)",
    "parser": "opencode",
    "protocol": "http",
    "host": "127.0.0.1",
    "port": 4472,
    "timeout": 10000,
    "apiRoutes": {
        "sessions": "/session",
        "messages": "/session/{id}/message"
    }
}
```

| Field | Description |
|-------|-------------|
| `type` | Backend identifier (used to select the correct parser and connector) |
| `label` | Display name shown in the connector picker |
| `parser` | Parser name that converts the raw response into ConversationSpec |
| `protocol` | `http` or `https` |
| `host` | Backend hostname or IP address |
| `port` | Backend port number |
| `timeout` | Request timeout in milliseconds |
| `apiRoutes` | Route template map used by the proxy and datasource |

### Adding a New Backend

To add support for a new backend:

1. Create `frontend/config/mybackend.json` with connection settings
2. Add `"mybackend"` to `frontend/config/manifest.json`
3. Implement a connection class in `frontend/js/connections/mybackend.js`
4. Implement a datasource class in `frontend/js/datasource/mybackend.js`
5. Implement a parser in `frontend/js/parser/mybackend_parser.js`
6. Register the new type in both manager factories

See the [Architecture](/docs?doc=architecture/overview) section for details on the factory pattern.

<div class="docs-callout docs-callout-warning">
  <i class="fa-solid fa-triangle-exclamation"></i>
  <div>
    <strong>Connection Errors</strong>
    <p>If the backend is unreachable, the request will timeout after the configured duration (default 10s). Check that OpenCode is running on <code>127.0.0.1:4472</code> and that the host/port in <code>opencode.json</code> are correct. Because the dashboard proxies the calls, a browser-side CORS error means the dashboard server itself isn't reachable on <code>4474</code>.</p>
  </div>
</div>
