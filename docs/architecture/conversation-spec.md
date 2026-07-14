## ConversationSpec

The normalized data model that every extractor and renderer consumes. Parsers are responsible for producing this shape; nothing downstream knows about a backend's raw format.

```
{
  version: "1.0",

  source: "opencode",             // "opencode" | "cursor" | "claude" | ...

  session: {
    id: "",
    title: "",
    startedAt: null,
    completedAt: null
  },

  assistant: {
    agent: "",
    model: "",
    provider: ""
  },

  metrics: {
    inputTokens: 0,
    outputTokens: 0,
    reasoningTokens: 0,
    totalTokens: 0,
    cacheRead: 0,
    cacheWrite: 0,
    cost: 0,

    // Populated only when a capture source is available. The estimated
    // token cost of system-prompt content sent to the model — separate
    // from conversation input/output tokens above.
    systemPromptTokens: 0
  },

  // Each message may optionally carry:
  //   message.systemPrompt : { partCount, totalChars, estimatedTokens, parts }
  //   message.params       : { temperature, topP, options }
  // (only present when capture data was merged for that request)
  messages: [],                   // Compiled messages with parts

  timeline: [],                  // Sorted events (MESSAGE, REASONING, TOOL_START, TOOL_END)

  tools: [],                     // Tool calls with duration and status

  // Hidden/background model calls (e.g. OpenCode's title-generation or
  // compaction calls) kept separate so they aren't miscounted as part of
  // the visible conversation.
  backgroundCalls: [],

  metadata: {}
}
```

### Source types

`source` identifies which backend produced the data. The parser registry maps this string to a parser function (see [API Reference › Parser](/docs?doc=api/parser)), so a new provider only needs to register its `source` value.
