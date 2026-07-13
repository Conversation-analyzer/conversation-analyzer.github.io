## Supported Backends

AI Conversation Analyzer is designed to support multiple AI coding assistants through a plugin-like architecture. Currently OpenCode is fully supported, with more backends planned.

### Current Support

| Backend | Status | Parser | Connection | DataSource |
|---------|--------|--------|------------|------------|
| OpenCode | Supported | `opencode_parser.js` | `opencode.js` | `opencode.js` |
| Claude Code | Planned | — | — | — |
| Cursor | Planned | — | — | — |
| Gemini CLI | Planned | — | — | — |
| OpenAI Agents | Planned | — | — | — |

### Architecture

Each backend requires four components:

```
config/mybackend.json      → Connection settings
js/connections/mybackend.js → HTTP client
js/datasource/mybackend.js  → API methods
js/parser/mybackend_parser.js → JSON → ConversationSpec
```

Two factory modules wire everything together:

- **ConnectionManager** (`js/connections/manager.js`) — reads `config.type` and instantiates the matching connection class
- **DataSourceManager** (`js/datasource/manager.js`) — reads `connection.type` and instantiates the matching datasource class

### Adding a New Backend

<ol class="docs-steps">
  <li>
    <span class="docs-step-num">1</span>
    <div>
      <strong>Create the config file</strong>
      <p>Add <code>config/mybackend.json</code> with connection settings (type, label, protocol, host, port, timeout). Follow the same structure as <code>opencode.json</code>.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">2</span>
    <div>
      <strong>Register in manifest</strong>
      <p>Add <code>"mybackend"</code> to the array in <code>config/manifest.json</code>. This makes the backend appear in the connector picker modal.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">3</span>
    <div>
      <strong>Create the connection class</strong>
      <p>Add <code>js/connections/mybackend.js</code>. This class wraps <code>fetch()</code> with timeout handling and provides a <code>get(path)</code> method. Follow the pattern in <code>opencode.js</code>.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">4</span>
    <div>
      <strong>Create the datasource class</strong>
      <p>Add <code>js/datasource/mybackend.js</code>. This class uses the connection to implement <code>getMessages(sessionId)</code> and <code>getLatestSession()</code>. These are the only two methods the app needs.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">5</span>
    <div>
      <strong>Create the parser</strong>
      <p>Add <code>js/parser/mybackend_parser.js</code>. This is the most important file — it converts the backend's raw JSON into a <code>ConversationSpec</code>. You'll need to map the backend's message format to the normalized model.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">6</span>
    <div>
      <strong>Register in factories</strong>
      <p>Add a <code>case</code> statement in both <code>ConnectionManager.create()</code> and <code>DataSourceManager.create()</code> to handle your new type.</p>
    </div>
  </li>
</ol>

### What the Parser Must Produce

The parser receives the raw response from <code>getMessages(sessionId)</code> and must return a fully populated [ConversationSpec](/docs?doc=architecture/conversation-spec) object:

```js
{
    version: "1.0",
    source: "mybackend",
    session: { id, title, startedAt, completedAt },
    assistant: { agent, model, provider },
    metrics: { inputTokens, outputTokens, reasoningTokens, totalTokens, cacheRead, cacheWrite, cost },
    messages: [/* compiled message objects */],
    timeline: [/* chronological events */],
    tools: [/* tool call objects */],
    metadata: {}
}
```

Each message must have: <code>id</code>, <code>parentId</code>, <code>role</code>, <code>createdAt</code>, <code>completedAt</code>, <code>finishReason</code>, <code>agent</code>, <code>model</code>, <code>provider</code>, and <code>parts[]</code> (with <code>type</code>, <code>text</code>, timestamps, and optional tool references).

Each tool must have: <code>id</code>, <code>name</code>, <code>status</code>, <code>input</code>, <code>output</code>, <code>startedAt</code>, <code>completedAt</code>, <code>duration</code>.

### Using the OpenCode Parser as Reference

The OpenCode parser (`js/parser/opencode_parser.js`) is ~120 lines and demonstrates the full pattern:

1. Validate input is an array
2. Deep-clone the ConversationSpec template
3. Iterate messages, extracting metadata from the first message
4. Accumulate token metrics
5. Build compiled message objects with parts
6. Extract tool calls and create timeline events
7. Sort timeline by timestamp
8. Return the populated ConversationSpec

<div class="docs-callout docs-callout-tip">
  <i class="fa-solid fa-lightbulb"></i>
  <div>
    <strong>Tip</strong>
    <p>Most parsers are under 150 lines. The hardest part is mapping the backend's message format to the ConversationSpec model. Start by looking at a sample response from the backend's API and identifying where each required field lives.</p>
  </div>
</div>

<div class="docs-callout docs-callout-note">
  <i class="fa-solid fa-circle-info"></i>
  <div>
    <strong>Importing the Template</strong>
    <p>The ConversationSpec template is exported from <code>js/models/conversation.js</code>. Import it with <code>import { ConversationSpec } from '../models/conversation.js'</code> and deep-clone it with <code>structuredClone()</code> or <code>JSON.parse(JSON.stringify())</code>.</p>
  </div>
</div>
