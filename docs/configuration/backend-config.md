## Backend Config

Configure connection details in `config/opencode.json`.

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
        <td>Connection type identifier.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td><code>"OpenCode (local)"</code></td>
        <td>Display name shown in the connector picker.</td>
      </tr>
      <tr>
        <td><code>protocol</code></td>
        <td><code>string</code></td>
        <td><code>"http"</code></td>
        <td>HTTP or HTTPS.</td>
      </tr>
      <tr>
        <td><code>host</code></td>
        <td><code>string</code></td>
        <td><code>"127.0.0.1"</code></td>
        <td>Backend hostname or IP.</td>
      </tr>
      <tr>
        <td><code>port</code></td>
        <td><code>number</code></td>
        <td><code>4472</code></td>
        <td>Backend port number.</td>
      </tr>
      <tr>
        <td><code>timeout</code></td>
        <td><code>number</code></td>
        <td><code>10000</code></td>
        <td>Request timeout in milliseconds.</td>
      </tr>
    </tbody>
  </table>
</div>
