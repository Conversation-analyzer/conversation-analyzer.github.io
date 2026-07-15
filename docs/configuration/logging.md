## Logging & Uninstall

When AI Conversation Analyzer runs as an OpenCode plugin, all backend output — HTTP request traces, lifecycle events, and errors — is written to a rotating log file on disk rather than printed to your terminal. This keeps the host terminal (e.g. OpenCode's own logs) clean and readable.

### Log File Location

Logs are stored under your user data directory:

```
~/.local/share/conversation-analyzer/logs/conversation-analyzer.log
```

Rotated backups are named `conversation-analyzer.log.1` through `conversation-analyzer.log.5`, where `.1` is the most recent.

### Rotation

The logger uses size-based rotation:

- **Max file size:** 10 MB per file (default)
- **Backups kept:** 5 (default)

When the active log exceeds the size limit, it is shifted to `.1`, the previous `.1` becomes `.2`, and so on, dropping the oldest backup.

### Configuration

All logging behavior can be overridden with environment variables:

<div class="docs-table-wrap">
  <table class="docs-table">
    <thead>
      <tr>
        <th>Variable</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>CONV_ANALYZER_LOG_DIR</code></td>
        <td><code>~/.local/share/conversation-analyzer/logs</code></td>
        <td>Directory where log files are written.</td>
      </tr>
      <tr>
        <td><code>CONV_ANALYZER_LOG_MAX_BYTES</code></td>
        <td><code>10485760</code> (10&nbsp;MB)</td>
        <td>Maximum size of a single log file before rotation.</td>
      </tr>
      <tr>
        <td><code>CONV_ANALYZER_LOG_MAX_FILES</code></td>
        <td><code>5</code></td>
        <td>Number of rotated backup files to retain.</td>
      </tr>
    </tbody>
  </table>
</div>

### Why Logs Go to a File

Printing every backend request to the terminal is noisy and interferes with other tools sharing that terminal (such as OpenCode). Redirecting all `console.*` output to a file preserves the information while keeping the terminal readable. Open the log file with any text viewer to inspect plugin activity.

### Uninstalling

AI Conversation Analyzer cleans up after itself on removal.

- Run `npm run uninstall` for an explicit cleanup, or `npm uninstall -g ai-conversation-analyzer` (the `preuninstall` hook runs the same routine).
- The cleanup **removes the plugin reference** from your OpenCode config (`opencode.jsonc`) and **deletes OpenCode's cached copy** of the plugin.

<div class="docs-callout docs-callout-warning">
  <i class="fa-solid fa-triangle-exclamation"></i>
  <div>
    <strong>Your data is preserved by default</strong>
    <p>Captured conversations and logs live in <code>~/.local/share/conversation-analyzer/</code>. The uninstaller only deletes this directory when you explicitly confirm the prompt in an interactive terminal. When run non-interactively it leaves the data in place and prints the path so you can delete it manually.</p>
  </div>
</div>
