## Renderer

The renderer turns extractor output into the five dashboard tabs. It is the **presentation** layer and has no knowledge of any backend — it only ever receives slices of a [ConversationSpec](/docs?doc=architecture/conversation-spec).

### Tabs

| Tab | Data source | Rendered by |
|-----|-------------|-------------|
| **Overview** | `extractSession`, `extractMetrics`, `extractSummary` | `renderer.js` (health ring, metric cards) |
| **Timeline** | `extractTimeline` | `renderer.js` (filterable event stream) |
| **Messages** | `extractMessages` | `grids.js` (AG Grid) |
| **Tools** | `extractTools` | `grids.js` (AG Grid) |
| **Insights** | `extractMetrics`, `extractTimeline` | `charts.js` (Plotly) |

### Implementation notes

- `js/renderer.js` owns all HTML rendering and tab switching.
- `js/grids.js` wraps AG Grid for the sortable, filterable Messages and Tools tables.
- `js/charts.js` renders the Plotly charts on the Insights tab.

Unlike the parser and extractors, the renderer is an internal presentation module rather than a public API — it is documented here for completeness, but consumers integrate via the upload/connect flows, not by calling renderer functions directly.
