## App Settings

Application-level defaults are stored in `frontend/config/analyzer.json`. These control the initial state of the dashboard when the app loads.

### Configuration File

```json
{
    "theme": "dark",
    "defaultTab": "overview"
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
        <td><code>theme</code></td>
        <td><code>string</code></td>
        <td><code>"dark"</code></td>
        <td>Default theme applied on first visit. Options: <code>"dark"</code> or <code>"light"</code>. Once the user toggles the theme, the choice is saved to <code>localStorage</code> under the key <code>ca-theme</code> and overrides this value on subsequent visits.</td>
      </tr>
      <tr>
        <td><code>defaultTab</code></td>
        <td><code>string</code></td>
        <td><code>"overview"</code></td>
        <td>Tab shown on startup before any data is loaded. Options: <code>"overview"</code>, <code>"timeline"</code>, <code>"messages"</code>, <code>"tools"</code>, <code>"insights"</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

### How Theme Works

The theme system uses CSS custom properties (variables) defined in `frontend/css/style.css`. When the app loads:

1. `getStoredTheme()` checks <code>localStorage</code> for a <code>ca-theme</code> key
2. If found, that theme is applied. If not, the <code>theme</code> value from <code>analyzer.json</code> is used
3. The <code>data-theme</code> attribute is set on the <code>&lt;html&gt;</code> element
4. All CSS variables resolve based on this attribute

When the user clicks the sun/moon toggle in the navigation bar:

1. The theme switches between <code>"dark"</code> and <code>"light"</code>
2. The new value is saved to <code>localStorage</code>
3. A <code>theme-changed</code> custom event is dispatched
4. The active tab re-renders to update chart and grid colors

AG Grid automatically adapts via theme class switching (<code>ag-theme-quartz</code> vs <code>ag-theme-quartz-dark</code>). Plotly charts read CSS variable colors through the <code>themeColors()</code> helper.

### How Default Tab Works

The <code>defaultTab</code> value is used by <code>frontend/js/app.js</code> during initialization. It sets <code>state.activeTab</code> before any data is loaded, so the empty state renders in the correct tab view.

Once the user clicks a tab, their choice is stored in <code>state.activeTab</code> for the rest of the session. The <code>defaultTab</code> config only affects the initial load.

<div class="docs-callout docs-callout-note">
  <i class="fa-solid fa-circle-info"></i>
  <div>
    <strong>File Location</strong>
    <p>The config file is at <code>frontend/config/analyzer.json</code> (it ships inside the published npm package). It's loaded by <code>frontend/config/loader.js</code> via <code>loadConfig("analyzer")</code>.</p>
  </div>
</div>
