# Mermaid Syntax Quick Reference

Condensed from the official Mermaid docs at `mermaid.js.org/syntax/*`.
Library version: `mermaid@11.16.0`.

---

## Flowchart — `flowchart` (alias: `graph`)

```mermaid
flowchart LR
  A[Start] --> B{Decision}
  B -->|yes| C[OK]
  B -->|no| D[Cancel]
```

**Directions:** `TB` / `TD` (top→bottom), `BT`, `LR` (left→right), `RL`

**Node shapes:**
- `[rect]` `(round)` `([stadium])` `[[subroutine]]` `[(cylinder)]` `((circle))`
- `>asym]` `{diamond}` `{{hexagon}}` `[/parallelogram/]` `[\trap\]` `[/trap/]`

**Edges:**
- `---` line, `-->` arrow, `-.->` dotted, `==>` thick
- `--text-->` or `-->|text|` labeled
- `---o` circle end, `---x` cross end, `<-->` bidirectional

**Subgraphs:** `subgraph id[Title] ... end`

**Styling:**
```
classDef myStyle fill:#9f9,stroke:#333
class NodeA myStyle
NodeA:::myStyle
```

---

## Sequence — `sequenceDiagram`

```mermaid
sequenceDiagram
  Alice->>Bob: Hello
  Bob-->>Alice: Hi back
```

**Arrows:**
| Syntax | Meaning |
|--------|---------|
| `->` | solid line, no arrowhead |
| `-->` | dotted line, no arrowhead |
| `->>` | solid arrow |
| `-->>` | dotted arrow |
| `<<->>` | solid bidirectional (v11.0.0+) |
| `<<-->>` | dotted bidirectional (v11.0.0+) |
| `-x` | solid cross end |
| `--x` | dotted cross end |
| `-)` | async open arrow (solid) |
| `--)` | async open arrow (dotted) |

**Control blocks:**
```
alt Happy path
  A->>B: ok
else Error
  A->>B: retry
end

opt Only if auth
  ...
end

loop Retry 3x
  ...
end

par Concurrent
  A->>B: send
and
  A->>C: send
end

break On failure
  ...
end
```

**Notes:** `Note over A,B: text` · `Note right of A: text`
**Autonumber:** `autonumber` at top of diagram
**Activations:** `A->>+B: ...` / `B-->>-A: ...`

---

## State — `stateDiagram-v2`

```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Active: start
  Active --> [*]: done
```

**Composite states:** `state Parent { ... }`
**Notes:** `note right of Active : text`
**Concurrency:** `state Fork <<fork>>` / `state Join <<join>>`

---

## Class — `classDiagram`

```mermaid
classDiagram
  class Animal {
    +name: string
    +speak() void
  }
  Animal <|-- Dog
```

**Visibility:** `+` public · `-` private · `#` protected · `~` package
**Stereotypes:** `<<interface>>` `<<abstract>>` `<<service>>` `<<enumeration>>`
**Relationships:** `<|--` inheritance · `*--` composition · `o--` aggregation · `-->` association · `..|>` realization · `..>` dependency

---

## ER — `erDiagram`

```mermaid
erDiagram
  USER ||--o{ ORDER : places
  ORDER ||--|{ LINE_ITEM : contains
```

**Cardinality:**
- `|o` / `o|` — zero or one
- `||` / `||` — exactly one
- `}o` / `o{` — zero or more
- `}|` / `|{` — one or more

`||--|{` = identifying · `||--o{` = non-identifying

**Attributes:**
```
ENTITY {
  type name PK
  type name FK
  type name UK
}
```

---

## Gantt — `gantt`

```mermaid
gantt
  title Plan
  dateFormat YYYY-MM-DD
  section Build
    Spec     :done, a1, 2026-01-01, 5d
    Build    :active, a2, after a1, 10d
    Deploy   :crit, a3, after a2, 3d
    Launch   :milestone, m1, after a3, 0d
```

**Date formats:** `YYYY-MM-DD` · `HH:mm` for time-of-day
**Axis format:** `axisFormat %H:%M` or `axisFormat %b %d`
**Tags:** `done` · `active` · `crit` · `milestone`
**Dependencies:** `after taskId`
**Excludes:** `excludes weekends` or `excludes 2026-01-01`
**Duration units:** `ms`, `s`, `m`, `h`, `d`, `w`, `M`, `y`

---

## Timeline — `timeline`

```mermaid
timeline
  title Project history
  2024 : Alpha
       : Beta
  2025 : v1.0 GA
  2026 : v2.0
```

---

## Gitgraph — `gitGraph`

```mermaid
gitGraph
  commit
  commit tag: "v1.0"
  branch feature
  checkout feature
  commit
  checkout main
  merge feature tag: "v1.1"
  commit
```

**Operations:** `commit [id:"x"] [tag:"v"] [type: NORMAL|REVERSE|HIGHLIGHT]`
`branch name` · `checkout name` · `merge name [tag]` · `cherry-pick id:"..."`

---

## XY Chart — `xychart-beta`

```mermaid
xychart-beta
  title "Build time (seconds)"
  x-axis [c1, c2, c3, c4, c5]
  y-axis "Seconds" 0 --> 180
  line [120, 135, 128, 142, 165]
  bar  [110, 130, 125, 140, 160]
```

One `line [...]` or `bar [...]` per series.

---

## Sankey — `sankey-beta`

```mermaid
sankey-beta
  Source,A,40
  Source,B,25
  A,Target,40
  B,Target,25
```

CSV rows: `from,to,value`

---

## Radar — `radar-beta` (v11.6.0+)

```mermaid
radar-beta
  axis Coverage, Complexity, Coupling, TestSpeed
  curve service_a { 85, 30, 20, 90 }
  curve service_b { 70, 55, 45, 60 }
```

---

## Pie — `pie`

```mermaid
pie
  title Cloud spend
  "Compute" : 45
  "Storage" : 20
  "Network" : 15
  "Other"   : 20
```

---

## Mindmap — `mindmap`

```mermaid
mindmap
  root((Platform))
    Storage
      Object
      Block
    Compute
      Containers
      Functions
```

Indentation = hierarchy. Shape prefixes for root: `((circle))` `)box(` `)rounded(`

---

## Quadrant — `quadrantChart`

```mermaid
quadrantChart
  title Impact vs Effort
  x-axis Low effort --> High effort
  y-axis Low impact --> High impact
  quadrant-1 Quick wins
  quadrant-2 Strategic
  quadrant-3 Ignore
  quadrant-4 Reconsider
  AuthRefactor: [0.2, 0.8]
  DBMigration:  [0.8, 0.9]
```

Points are `[x, y]` in 0–1 range.

---

## Kanban — `kanban`

```mermaid
kanban
  Backlog
    [Auth refactor]
    [Rate limiter]
  Doing
    [Payment retries]
  Done
    [Cache invalidation]
```

---

## Packet — `packet-beta` (v11.0.0+)

```mermaid
packet-beta
  0-7:  "Header"
  8-15: "Source port"
  16-23: "Dest port"
  24-31: "Length"
```

---

## Requirement — `requirementDiagram`

```mermaid
requirementDiagram
  requirement sla {
    id: 1
    text: 99.9% uptime monthly
    risk: high
    verifyMethod: measurement
  }
  functionalRequirement p99 {
    id: 2
    text: p99 < 500ms
  }
  sla - contains -> p99
```

---

## C4 — `C4Context` / `C4Container` / `C4Component`

```mermaid
C4Context
  title System context
  Person(user, "User", "End user")
  System(app, "My App", "Core system")
  System_Ext(cdn, "CDN", "Content delivery")
  Rel(user, app, "Uses")
  Rel(app, cdn, "Serves via")
```

```mermaid
C4Container
  Person(user, "User")
  System(webapp, "Web App", "React SPA")
  System(api,    "API",     "Node.js")
  System(db,     "DB",      "Postgres")
  Rel(user, webapp, "Uses", "HTTPS")
  Rel(webapp, api,  "Calls", "REST")
  Rel(api,  db,     "Reads/writes", "SQL")
```

---

## Architecture — `architecture-beta` (v11.1.0+)

```mermaid
architecture-beta
  group api(cloud)[API Tier]
  service web(server)[Web]
  service app(server)[API]
  service db(database)[Database]
  web --> app : HTTP
  app --> db  : SQL
```

Icons: `server`, `database`, `disk`, `internet`, `cloud`

---

## Block — `block-beta`

```mermaid
block-beta
  columns 3
  A B C
  D E F
  G --> H
  classDef done fill:#9f9,stroke:#333
  class G done
```

---

## Configuration (frontmatter — v10.5.0+)

```mermaid
---
config:
  theme: dark
  themeVariables:
    primaryColor: "#bb2525"
  flowchart:
    curve: basis
---
flowchart LR
  A --> B
```

**Themes:** `default` · `dark` · `forest` · `neutral` · `base`

---

## Common errors

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| "Syntax error" near an arrow | Reserved word as bare node ID | Quote it: `A["end"]` |
| Diagram doesn't render on host | Host doesn't support that type | Fall back to `flowchart` |
| `&` in labels breaks parsing | Confused with HTML entity | Use `&amp;` or reword |
| Quotes inside labels | Parser confusion | Use `#quot;` or avoid |
| Blank re-render | `mermaid.run()` called twice | Use `startOnLoad: true` only |
