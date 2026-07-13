## Backend Config

Each supported backend has its own configuration file in the `config/` directory. These files define how the app connects to the backend's HTTP API.

### OpenCode Configuration

The default backend is OpenCode, configured in `config/opencode.json`:

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
        <td>Backend identifier. Used by the ConnectionManager and DataSourceManager factories to select the correct classes. Must match the directory names under <code>js/connections/</code> and <code>js/datasource/</code>.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td><code>"OpenCode (local)"</code></td>
        <td>Display name shown in the connector picker modal. This is what the user sees when selecting a backend.</td>
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
    </tbody>
  </table>
</div>

### How the Config Is Used

The config flows through three layers:

```
config/opencode.json → ConnectionManager.create(config) → OpenCodeConnection(config)
                                                              ↓
                                                     baseUrl = protocol://host:port
                                                              ↓
                                                     get(path) → fetch(baseUrl + path)
```

1. **Config loading** — <code>config/loader.js</code> fetches the JSON file and returns the parsed object
2. **Connection creation** — <code>ConnectionManager</code> reads <code>config.type</code> and instantiates the matching connection class
3. **URL construction** — The connection class builds <code>baseUrl</code> from protocol, host, and port
4. **Request execution** — The <code>get(path)</code> method appends the path to <code>baseUrl</code>, adds an <code>AbortSignal.timeout()</code>, and returns parsed JSON

### Config Manifest

The list of available backends is defined in `config/manifest.json`:

```json
["opencode"]
```

When the connector picker modal opens, it calls <code>listConfigs()</code> which:

1. Fetches <code>manifest.json</code>
2. For each name in the array, fetches <code>config/{name}.json</code>
3. Returns an array of config objects with their names attached

### Modifying Connection Settings

To change the connection target (e.g. for a remote OpenCode instance):

1. Edit `config/opencode.json`
2. Update `host` and `port` to match your backend
3. Reload the page

No code changes or rebuild required — the config is loaded at runtime via <code>fetch()</code>.

<div class="docs-callout docs-callout-warning">
  <i class="fa-solid fa-triangle-exclamation"></i>
  <div>
    <strong>CORS Requirements</strong>
    <p>The backend must allow cross-origin requests from your browser's origin. If you see CORS errors in the browser console, the backend needs to be configured to accept requests from <code>http://localhost:8080</code> (or whatever port you're serving the app on).</p>
  </div>
</div>
