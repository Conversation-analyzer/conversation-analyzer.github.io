## Datasource API

High-level fetchers that use a [connection](/docs?doc=api/connectors) to retrieve sessions and messages. A datasource wraps a connection and resolves route templates from the backend's `apiRoutes`.

### `OpenCodeDataSource`

```javascript
import { OpenCodeDataSource } from "frontend/js/datasource/opencode.js";

const ds = new OpenCodeDataSource(connection);

const sessions = await ds.getLatestSession();        // GET /api/session
const session  = await ds.getSession(sessionId);     // GET /api/session/{id}
const messages = await ds.getMessages(sessionId);    // GET /api/session/{id}/message
```

| Method | Upstream route (via proxy) | Returns |
|--------|---------------------------|---------|
| `getLatestSession()` | `GET /session` | List of all sessions |
| `getSession(id)` | `GET /session/{id}` | Metadata for one session |
| `getMessages(id)` | `GET /session/{id}/message` | All messages for a session |

Route paths are derived from the connection's `routes` (the `apiRoutes` block): `{id}` is replaced with the session ID, and `getSession` strips the trailing `/message` to hit the session endpoint.

### `DataSourceManager`

```javascript
import { DataSourceManager } from "frontend/js/datasource/manager.js";

const ds = DataSourceManager.create(connection);  // -> new OpenCodeDataSource(connection)
```

A factory that switches on `connection.type` and returns the matching datasource. Throws `Unsupported datasource: <type>` for unknown backends.
