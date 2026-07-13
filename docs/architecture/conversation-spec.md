## ConversationSpec

The normalized data model that all renderers consume.

```
{
  version: "1.0",
  source: "opencode",             // "opencode" | "cursor" | "claude" | ...
  session: {
    id: "ses_...",
    title: "...",
    startedAt: "...",
    completedAt: "..."
  },
  assistant: {
    agent: "...",
    model: "...",
    provider: "..."
  },
  metrics: {
    inputTokens: 0,
    outputTokens: 0,
    reasoningTokens: 0,
    totalTokens: 0,
    cacheRead: 0,
    cacheWrite: 0,
    cost: 0
  },
  messages: [...],                // Compiled messages with parts
  timeline: [...],                // Sorted events (MESSAGE, REASONING, TOOL_START, TOOL_END)
  tools: [...],                   // Tool calls with duration and status
  metadata: {}
}
```
