## Backend Config

Each supported backend has its own configuration file in the `frontend/config/` directory. These files define how the dashboard connects to the backend's HTTP API and which parser and capture modules to use for that backend.

### OpenCode Configuration

The default backend is OpenCode, configured in `frontend/config/opencode.json`:

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

### Reference

<div class="docs-table-wrap">
  <table class="docs-table">
    <thead>
      <tr>
        <th>Key</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>type</code></td>
        <td><code>string</code></td>
        <td><code>"opencode"</code></td>
        <td>Backend identifier. Selects the connection, datasource, parser, and capture modules. Must match the registry keys under <code>frontend/js</code>.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td><code>"OpenCode (local)"</code></td>
        <td>Display name shown in the connector picker modal.</td>
      </tr>
      <tr>
        <td><code>parser</code></td>
        <td><code>string</code></td>
        <td><code>"opencode"</code></td>
        <td>Parser registry key that maps the backend's raw JSON to a <code>ConversationSpec</code>. Resolved by <code>frontend/js/parser/parser_registry.js</code>.</td>
      </tr>
      <tr>
        <td><code>protocol</code></td>
        <td><code>string</code></td>
        <td><code>"http"</code></td>
        <td>HTTP protocol to use. Options: <code>"http"</code> or <code>"https"</code>.</td>
      </tr>
      <tr>
        <td><code>host</code></td>
        <td><code>string</code></td>
        <td><code>"127.0.0.1"</code></td>
        <td>Hostname or IP address of the backend server. Use <code>127.0.0.1</code> for local connections, or a remote IP/hostname for network access.</td>
      </tr>
      <tr>
        <td><code>port</code></td>
        <td><code>number</code></td>
        <td><code>4472</code></td>
        <td>Port number the backend listens on. OpenCode defaults to 4472.</td>
      </tr>
      <tr>
        <td><code>timeout</code></td>
        <td><code>number</code></td>
        <td><code>10000</code></td>
        <td>Request timeout in milliseconds. If the backend doesn't respond within this duration, the request is aborted. Increase this for slow backends or large sessions.</td>
      </tr>
      <tr>
        <td><code>apiRoutes</code></td>
        <td><code>object</code></td>
        <td><code>{ sessions, messages }</code></td>
        <td>Endpoint path map used by the dashboard proxy. <code>sessions</code> lists sessions; <code>messages</code> fetches messages for a session (the <code>{id}</code> placeholder is replaced with the session ID).</td>
      </tr>
    </tbody>
  </table>
</div>

### How the Config Is Used

The config flows through three layers:

```
frontend/config/opencode.json → ConnectionManager.create(config) → OpenCodeConnection(config)
                                                              ↓
                                                     baseUrl = protocol://host:port
                                                              ↓
                                            proxy /api/session/* → fetch(baseUrl + path)
```

1. **Config loading** — <code>frontend/config/loader.js</code> fetches the JSON file and returns the parsed object
2. **Connection creation** — <code>ConnectionManager</code> reads <code>config.type</code> and instantiates the matching connection class
3. **URL construction** — The connection class builds <code>baseUrl</code> from protocol, host, and port
4. **Request execution (via proxy)** — The dashboard's Node server exposes <code>/api/session/*</code> and forwards requests to <code>baseUrl + path</code>, adding an <code>AbortSignal.timeout()</code>. The browser never calls OpenCode directly, so CORS is handled server-side.

### Config Manifest

The list of available backends is defined in `frontend/config/manifest.json`:

```json
["opencode"]
```

When the connector picker modal opens, it calls <code>listConfigs()</code> which:

1. Fetches <code>manifest.json</code>
2. For each name in the array, fetches <code>frontend/config/{name}.json</code>
3. Returns an array of config objects with their names attached

The same manifest is what <code>conversation-analyzer init</code> reads to discover backends during interactive setup.

### Modifying Connection Settings

To point at a remote OpenCode instance:

1. Edit `frontend/config/opencode.json`
2. Update `host` and `port` to match your backend
3. Reload the page

No code changes or rebuild required — the config is loaded at runtime via <code>fetch()</code>.

<div class="docs-callout docs-callout-note">
  <i class="fa-solid fa-circle-info"></i>
  <div>
    <strong>Two separate OpenCode configs</strong>
    <p><code>frontend/config/opencode.json</code> is the <em>dashboard's</em> connection settings (where to find OpenCode's API). The OpenCode <em>application</em> config at <code>~/.config/opencode/opencode.jsonc</code> is different — that's where <code>conversation-analyzer init</code> registers the plugin via the <code>"plugin"</code> key.</p>
  </div>
</div>

<div class="docs-callout docs-callout-warning">
  <i class="fa-solid fa-triangle-exclamation"></i>
  <div>
    <strong>No manual CORS needed</strong>
    <p>Because the dashboard server proxies OpenCode's API, your browser only talks to <code>http://127.0.0.1:4474</code>. You only need to worry about CORS if you bypass the proxy and serve the frontend from a different static host.</p>
  </div>
</div>
