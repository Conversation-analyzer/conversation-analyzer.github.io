## Parser API

Converts raw backend data into a [ConversationSpec](/docs?doc=architecture/conversation-spec).

### `parseOpenCodeSession(data)`

```javascript
import { parseOpenCodeSession } from "frontend/js/parser/opencode_parser.js";

const conversation = parseOpenCodeSession(rawJsonArray);
```

| Argument | Type | Description |
|----------|------|-------------|
| `data` | `Array` | An OpenCode session — an array of message objects, each with `info` and `parts`. |

**Returns:** a `ConversationSpec`. Throws if `data` is not an array.

**Behavior:**
- Reads `info` (session ID, model, provider, token counts, timings) and `parts` (message text, reasoning, tool calls) from each message.
- Builds normalized `messages`, appends `MESSAGE` / `REASONING` / `TOOL_START` / `TOOL_END` events to `timeline`, and pushes `tools` entries.
- Accumulates `metrics` (input/output/reasoning/cache tokens, cost) across messages.
- Sorts `timeline` chronologically before returning.

### Parser registry

```javascript
import { getParser, registerParser } from "frontend/js/parser/parser_registry.js";

const parser = getParser("opencode");        // -> parseOpenCodeSession
registerParser("cursor", parseCursorSession); // future provider
```

| Function | Description |
|----------|-------------|
| `getParser(sourceType)` | Returns the parser for a `source` value, or throws if unregistered. |
| `registerParser(sourceType, parserFn)` | Registers a parser function for a new provider. |

### Capture merge (OpenCode)

```javascript
import { mergeCaptureIntoConversation }
    from "frontend/js/parser/opencode_capture.js";

mergeCaptureIntoConversation(conversation, rawCaptureEvents);
```

Attaches local capture overhead (system-prompt token estimates, chat params, richer tool args/output) onto an already-parsed `ConversationSpec`. Background calls (e.g. title generation) are routed to `conversation.backgroundCalls` and excluded from token totals. `parseCaptureEvents(rawEvents)` is the lower-level helper that groups raw JSONL capture lines into paired requests and tool calls.
