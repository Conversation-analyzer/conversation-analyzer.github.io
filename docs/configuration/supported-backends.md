## Supported Backends

Extend the analyzer to support new AI platforms by adding 3 files and a config entry.

<ol class="docs-steps">
  <li>
    <span class="docs-step-num">1</span>
    <div>
      <strong>Create the connection class</strong>
      <p>Add <code>js/connections/myplatform.js</code> implementing the <code>get(path)</code> method.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">2</span>
    <div>
      <strong>Create the datasource class</strong>
      <p>Add <code>js/datasource/myplatform.js</code> implementing <code>getMessages(id)</code> and <code>getLatestSession()</code>.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">3</span>
    <div>
      <strong>Create the parser</strong>
      <p>Add <code>js/parser/myplatform_parser.js</code> to convert raw data into a <code>ConversationSpec</code>.</p>
    </div>
  </li>
  <li>
    <span class="docs-step-num">4</span>
    <div>
      <strong>Register in config</strong>
      <p>Add your config to <code>config/myplatform.json</code> and list it in <code>config/manifest.json</code>.</p>
    </div>
  </li>
</ol>

<div class="docs-callout docs-callout-tip">
  <i class="fa-solid fa-lightbulb"></i>
  <div>
    <strong>Tip</strong>
    <p>Use the existing OpenCode implementation as a reference. The connection, datasource, and parser files are under 100 lines each.</p>
  </div>
</div>
