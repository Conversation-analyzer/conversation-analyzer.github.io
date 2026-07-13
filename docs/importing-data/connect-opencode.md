## Connect to OpenCode

Connect directly to a running OpenCode instance to fetch and analyze live conversation data — no file export needed.

### Prerequisites

- OpenCode must be running and accessible on your network
- The backend must be listening on the configured host and port (default: `http://127.0.0.1:4472`)
- CORS must allow requests from your browser's origin (OpenCode typically allows this by default)

### How It Works

The connection flow uses a two-layer architecture:

```
Connector Picker → Connection (HTTP client) → DataSource (API calls) → Parser → Dashboard
```

1. **Connector Picker** — a modal that lists all configured backends from `config/manifest.json`
2. **Connection** — an HTTP client that wraps `fetch()` with timeout handling
3. **DataSource** — high-level methods for fetching sessions and messages
4. **Parser** — converts the raw response into ConversationSpec

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
      <p>The connector picker modal shows all configured backends. Each displays its label, type, and connection URL (e.g. <code>http://127.0.0.1:4472</code>).</p>
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
      <p>The app fetches messages from the backend, parses them, and renders all tabs. The session ID appears as a badge in the navigation bar.</p>
    </div>
  </li>
</ol>

### Fetching the Latest Session

If you don't know the session ID, leave the input field blank and click Connect. The app will:

1. Call `GET /session` on the backend
2. Sort sessions by creation time (descending)
3. Pick the most recent session
4. Fetch its messages and load them

### API Endpoints Used

The app communicates with OpenCode via these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/session` | GET | List all sessions |
| `/session/{id}` | GET | Get a specific session |
| `/session/{id}/message` | GET | Get all messages for a session |

All requests include an `AbortSignal.timeout()` based on the configured timeout (default: 10 seconds).

### Configuration

Backend settings are stored in `config/opencode.json`:

```json
{
    "type": "opencode",
    "label": "OpenCode (local)",
    "protocol": "http",
    "host": "127.0.0.1",
    "port": 4472,
    "timeout": 10000
}
```

| Field | Description |
|-------|-------------|
| `type` | Backend identifier (used to select the correct parser and connector) |
| `label` | Display name shown in the connector picker |
| `protocol` | `http` or `https` |
| `host` | Backend hostname or IP address |
| `port` | Backend port number |
| `timeout` | Request timeout in milliseconds |

### Adding a New Backend

To add support for a new backend:

1. Create `config/mybackend.json` with connection settings
2. Add `"mybackend"` to `config/manifest.json`
3. Implement a connection class in `js/connections/mybackend.js`
4. Implement a datasource class in `js/datasource/mybackend.js`
5. Implement a parser in `js/parser/mybackend_parser.js`
6. Register the new type in both manager factories

See the [Architecture](/docs?doc=architecture/overview) section for details on the factory pattern.

<div class="docs-callout docs-callout-warning">
  <i class="fa-solid fa-triangle-exclamation"></i>
  <div>
    <strong>Connection Errors</strong>
    <p>If the backend is unreachable, the request will timeout after the configured duration (default 10s). Check that the backend is running and the host/port in <code>opencode.json</code> are correct.</p>
  </div>
</div>
