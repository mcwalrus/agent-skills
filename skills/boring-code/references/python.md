# Boring Code Philosophy: Python

## The Language Makes It Easy to Be Clever. Don't.

Python is expressive, concise, and genuinely beautiful at its best. It's also a language where the distance between readable code and impenetrable code is very short. List comprehensions, generators, decorators, metaclasses, dynamic attribute access — these features exist for good reasons, but they're frequently reached for too soon, at the wrong level of abstraction, by people who could have written something simpler.

The boring principle in Python is to use the language's readability as a ceiling, not a floor. Aim for code that a competent Python programmer can understand on first read. That bar is higher than it sounds.

---

## Core Rationale

### The Zen of Python Is Literal Advice

`import this` gives you the Zen of Python. It's not decorative. Several lines map directly to boring-code principles:

- *"Explicit is better than implicit."* Don't use magic. Don't use `__getattr__` to make attribute access do surprising things. Don't use metaclasses where a class method would do.
- *"Simple is better than complex. Complex is better than complicated."* There's a hierarchy. Simple first. Complex only when simple is genuinely insufficient.
- *"Readability counts."* Not just "readable code is nice" — readability is a primary goal.
- *"If the implementation is hard to explain, it's a bad idea."*

Read it again before reaching for a clever pattern.

### Type Hints: At Boundaries, Not Everywhere

Python's type hints are valuable — as documentation, as tooling signals, and as a lightweight way to make interfaces explicit. The boring rule is to annotate function signatures and public API surfaces consistently, and to be more relaxed about internal implementation details.

```python
# Good: clear boundary with types
def load_config(path: str) -> dict[str, Any]:
    ...

# Overkill: annotating every local variable
def load_config(path: str) -> dict[str, Any]:
    raw_bytes: bytes = Path(path).read_bytes()
    text: str = raw_bytes.decode("utf-8")
    data: dict[str, Any] = json.loads(text)
    return data
```

Use `mypy` or `pyright` in CI. Enforcing types at the tooling level means you don't need to be exhaustive in annotation — the tool will tell you where it needs help.

### List Comprehensions: One Condition, One Transform

List comprehensions are readable up to a point. That point is roughly one condition and one transformation. Beyond that, use a loop.

```python
# Readable
squares = [x * x for x in range(10) if x % 2 == 0]

# Too clever — write a loop
result = [
    transform(item)
    for sublist in nested_lists
    for item in sublist
    if predicate(item) and other_condition(item)
]
```

The test: read it out loud. If you stumble, it needs a loop. A loop with a clear variable name and an append is always readable. A dense comprehension often isn't.

### Exceptions: Don't Swallow, Don't Over-Catch

Python's exception system is easy to misuse in two directions. Over-catching — `except Exception:` or worse, bare `except:` — silences errors you didn't anticipate. Under-catching — letting exceptions propagate through ten frames before surfacing — makes debugging hard.

```python
# Bad: swallows everything
try:
    result = process(data)
except Exception:
    result = None

# Bad: catches too broadly and loses information
try:
    result = process(data)
except Exception as e:
    log.error("Something went wrong")
    raise

# Good: catch what you expect, let the rest propagate
try:
    result = process(data)
except ValueError as e:
    raise ConfigError(f"Invalid data format: {e}") from e
```

The `from e` in `raise X from e` preserves the original exception chain. Always use it when wrapping exceptions — it's free and invaluable when debugging.

### Classes: Only When You Need State and Behaviour Together

Python makes it easy to put everything in a class. Resist. A module with functions is simpler than a class with methods when there's no meaningful state to encapsulate. A `dataclass` is simpler than a hand-rolled `__init__` when you just need to hold data.

```python
# Unnecessary class — just functions
class StringUtils:
    @staticmethod
    def slugify(text: str) -> str:
        ...
    @staticmethod
    def truncate(text: str, length: int) -> str:
        ...

# Better: module-level functions
def slugify(text: str) -> str:
    ...

def truncate(text: str, length: int) -> str:
    ...
```

Use a class when you have state that changes over time, when you need to implement a protocol or interface, or when you're modeling a domain entity with identity. Not as a namespace.

### Dependency Management: Treat as a Real Decision

Python's ecosystem is vast and the quality is uneven. Every dependency you add is a version conflict waiting to happen, a security surface, and a maintenance commitment.

The boring rules:
- Pin your dependencies (use `pip-tools`, `poetry`, or `uv` with lockfiles).
- Prefer the standard library where it's sufficient. `pathlib`, `dataclasses`, `typing`, `logging`, `json`, `csv` — these cover a lot of ground.
- Before adding a library, read its source code or at minimum its changelog. Know what you're importing.
- One dependency that does the job well beats three that each do a piece.

### Virtualenvs Are Not Optional

Every project gets its own environment. This is not a suggestion. Polluting your system Python or sharing environments across projects creates version conflicts that are genuinely hard to debug.

Use `uv` for speed, or `venv` for simplicity. The point is isolation — one project, one environment, pinned dependencies.

---

## What to Resist

**Decorators for everything.** Decorators are powerful and often the right tool — `@property`, `@dataclass`, framework route decorators, `@lru_cache`. They're wrong when they're used to add behavior that should be explicit, or when stacking them makes the function's true signature invisible.

**Dynamic attribute magic.** `__getattr__`, `__setattr__`, `__missing__` — these exist. They're appropriate in frameworks and ORMs. In application code, they're usually a sign that the data model needs redesign, not dynamic lookup.

**Metaclasses.** Almost never needed in application code. If you're reaching for a metaclass, first consider whether a class decorator, a `__init_subclass__`, or a simple factory function would do the same job more readably.

**`*args` and `**kwargs` in public APIs.** They make the call site unpredictable and the function impossible to introspect without reading the source. Use explicit parameters. If the parameter list is long, that's often a sign the function is doing too much.

---

## The Standard Library First

Python's standard library is excellent and underused:

- `pathlib` over string path manipulation
- `dataclasses` over hand-rolled `__init__`
- `logging` over `print` for anything that matters
- `contextlib` for resource management patterns
- `itertools` before writing your own iteration logic
- `functools.lru_cache` before reaching for a caching library
- `collections.defaultdict`, `Counter`, `deque` — know these

These are battle-tested, zero-dependency, and familiar to other Python programmers.

---

## Summary

| Principle | Python Expression |
|-----------|------------------|
| Explicit over implicit | Type hints at boundaries; no magic attributes |
| Readable first | Comprehensions for simple cases; loops otherwise |
| Functions before classes | Classes only when state + behaviour are both present |
| Catch what you expect | Narrow exceptions; always chain with `from e` |
| Standard library first | Know what's available before adding dependencies |
| Virtualenvs always | Isolation is non-negotiable |
