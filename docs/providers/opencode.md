## OpenCode Provider

OpenCode is the first — and currently the only — built-in provider. This page documents the API surface the analyzer consumes from OpenCode, how the provider is configured, and how raw responses are normalized into the shared data model.

Additional providers (Cursor, Claude, and others) will be documented here as they are built. See [Coming Soon](#coming-soon) for the roadmap.

### Provider Metadata

| Property | Value |
|----------|-------|
| Identifier (`type`) | `opencode` |
| Display label | `OpenCode (local)` |
| Parser | `opencode` |
| Default protocol | `http` |
| Default host | `127.0.0.1` |
| Default port | `4472` |
| Config file | `frontend/config/opencode.json` |
| Registered in | `frontend/config/manifest.json` |

### Endpoints

The analyzer consumes three OpenCode API endpoints. In a running dashboard they are reached through the built-in proxy on `http://127.0.0.1:4474`, which forwards each call to OpenCode on `127.0.0.1:4472`. This keeps a single browser origin and avoids CORS issues.

| Dashboard path (proxied) | Upstream OpenCode path | Method | Purpose |
|--------------------------|------------------------|--------|---------|
| `/api/session` | `GET /session` | GET | List all sessions |
| `/api/session/{id}` | `GET /session/{id}` | GET | Fetch metadata for a single session |
| `/api/session/{id}/message` | `GET /session/{id}/message` | GET | Fetch all messages for a session |

The exact upstream paths are not hardcoded — they are defined per provider in the `apiRoutes` block of the config file (below). If you leave the session ID blank when connecting, the analyzer lists sessions, sorts them by creation time (descending), and loads the most recent one.

### Configuration

Provider settings live in `frontend/config/opencode.json`:

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
| `type` | Backend identifier; selects the correct parser and connector |
| `label` | Name shown in the connector picker |
| `parser` | Parser name that maps the raw response into ConversationSpec |
| `protocol` | `http` or `https` |
| `host` | Backend hostname or IP address |
| `port` | Backend port number |
| `timeout` | Per-request timeout in milliseconds (enforced via `AbortSignal`) |
| `apiRoutes` | Route template map consumed by the datasource and proxy |

To register the provider so it appears in the connector picker, its identifier must be listed in `frontend/config/manifest.json`:

```json
["opencode"]
```

### Response Normalization

Each raw response from the endpoints above is passed to the `opencode` parser, which produces a normalized [ConversationSpec](/docs?doc=architecture/conversation-spec). The dashboard's extractors and renderers then operate purely on that shared model, so any future provider only needs its own config + parser to slot in.

### Request Behavior

- Every request carries an `AbortSignal.timeout()` set from the `timeout` field (default 10 seconds).
- If the backend is unreachable, the request aborts after the timeout and the connector reports the error rather than hanging.
- Live polling re-issues `GET /api/session/{id}/message` on a fixed interval (default 4s) and merges new messages in place.

<div class="docs-callout docs-callout-note">
  <i class="fa-solid fa-circle-info"></i>
  <div>
    <strong>Reverse proxy, not direct CORS</strong>
    <p>The browser never talks to OpenCode directly. All traffic flows through the dashboard server on <code>4474</code>, which proxies to OpenCode on <code>4472</code>. This is why the documented paths are <code>/api/session/*</code> and not the raw OpenCode routes.</p>
  </div>
</div>

### Coming Soon

The provider framework is designed to be backend-agnostic. Each new provider requires only a config entry, a parser, and (optionally) a custom connection/datasource. Planned providers:

| Provider | Identifier | Status |
|----------|------------|--------|
| OpenCode | `opencode` | Supported |
| Cursor | `cursor` | Planned |
| Claude Code | `claude` | Planned |
| Custom / generic JSON | `generic` | Planned |

When a new provider ships, its API reference will be added as a sibling page under this Providers section.
