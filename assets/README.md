# Composition assets

Generated artefacts for [`skills/composition.yaml`](../skills/composition.yaml).

## Files

| File | Status | Purpose |
|---|---|---|
| `composition.mmd` | generated | Mermaid source for the skill composition graph |
| `composition.svg` | generated | Rendered diagram — commit after generating |
| `render-composition.mjs` | source | Generator script (zero-dep, Node ≥ 18) |

`skills/composition.yaml` is the source of truth — every other file in this
folder is derivable from it.

## Regenerating

```bash
node assets/render-composition.mjs
```

This reads `skills/composition.yaml`, validates that every referenced skill
exists under `skills/`, and writes `composition.mmd` here.

## Rendering to SVG

The `.mmd` file is **Mermaid**, not Graphviz DOT — `dot -Tsvg` will not parse
it. Use the Mermaid CLI:

```bash
npx -y @mermaid-js/mermaid-cli -i assets/composition.mmd -o assets/composition.svg
```

Then embed the SVG in the top-level `README.md`:

```markdown
![Skill composition](./assets/composition.svg)
```

## CI check

```bash
node assets/render-composition.mjs --check
```

Exits non-zero if `composition.mmd` is out of sync with
`skills/composition.yaml`. Wire this into CI to keep the diagram honest.

## Schema

```yaml
# <composite-skill>: [<constituent-skill>, ...]
walt-walk: [first-principles, five-whys, plain-english]
```

- Comments start with `#`
- Skill names must be lowercase kebab-case
- Skill names must exist as directories under `skills/`
- Edges point from composite → constituent
- Cycles are allowed (see [Classes](#classes))

The parser inside `render-composition.mjs` is intentionally minimal. If you
need richer metadata (edge labels, notes, ordering), extend the parser in the
same file — there's no external YAML library to keep in sync.

## Classes

Each skill is classified by the generator based on the graph structure —
nothing is declared explicitly.

| Class | Rule | Visual |
|---|---|---|
| `pure` | No outgoing edges — the skill doesn't depend on any other skill. Includes skills only referenced as constituents, never as a key. | green |
| `composite` | Has outgoing edges, and no cycle is reachable from it. | amber |
| `cyclical` | Has outgoing edges, and a cycle is reachable from it (self-reference or longer cycle). | red |

Examples of each in YAML form:

```yaml
# pure — no outgoing edges at all
# (declare nothing; or appear only as a target)

# composite — has edges, acyclic
story-writer: [first-principles, plain-english]

# cyclical — a self-reference
refine-iteratively: [refine-iteratively]

# cyclical — a two-step cycle
foo: [bar]
bar: [foo]
```

The script warns when it detects cyclical skills, since they're easy to
introduce by accident and may indicate intended recursion or a typo.