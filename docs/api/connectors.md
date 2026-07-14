## Connectors API

HTTP client classes that talk to a backend. All traffic flows through the dashboard's `/api` proxy (which forwards to the backend, e.g. OpenCode on `127.0.0.1:4472`), so the browser only ever uses relative `/api` paths and never hits the backend directly.

### `OpenCodeConnection`

```javascript
import { OpenCodeConnection } from "frontend/js/connections/opencode.js";

const conn = new OpenCodeConnection({
    type: "opencode",
    host: "127.0.0.1",
    port: 4472,
    protocol: "http",
    timeout: 10000,
    apiRoutes: {
        sessions: "/session",
        messages: "/session/{id}/message"
    }
});
```

| Property | Description |
|----------|-------------|
| `type` | Backend identifier (selects the parser/datasource). |
| `host` / `port` / `protocol` | Backend location (used by the proxy, not the browser fetch). |
| `timeout` | Per-request timeout in ms, applied via `AbortSignal.timeout()`. |
| `routes` | `apiRoutes` mapping; defaults to `{ sessions: "/session", messages: "/session/{id}/message" }`. |

`conn.baseUrl` is always `"/api"`. The single request method is:

```javascript
await conn.get("/session/{id}/message");  // GET, with AbortSignal.timeout(timeout)
```

It throws on a non-2xx response.

### `ConnectionManager`

```javascript
import { ConnectionManager } from "frontend/js/connections/manager.js";

const conn = ConnectionManager.create(config);  // -> new OpenCodeConnection(config)
```

A factory that switches on `config.type` and returns the matching connection class. Throws `Unsupported connection type: <type>` for unknown backends.
