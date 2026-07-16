# Boring Code Philosophy: Go

## The Language Was Designed for This

Go is the rare case where the language authors made boring code the path of least resistance. The toolchain enforces formatting (`gofmt`), the standard library sets a consistent idiomatic tone, and the feature set is deliberately small. When you fight Go's grain, you're working harder to produce worse code. The boring principle here isn't advice — it's alignment with the language's own values.

---

## Core Rationale

### Errors Are Values, Not Exceptions

Go's explicit error handling is the most argued-about design decision in the language and also its most important boring-code enabler. When errors are values returned from functions, every error-producing call is visible at the call site. There is no hidden control flow, no exception that unwinds the stack through ten layers of code you didn't write.

```go
// Boring. Obvious. Correct.
data, err := os.ReadFile("config.json")
if err != nil {
    return fmt.Errorf("reading config: %w", err)
}
```

The verbosity is the point. Every `if err != nil` is a reader's checkpoint — a visible moment where the author thought about what happens when things go wrong. Don't use a library to reduce this boilerplate. The boilerplate is load-bearing.

**Wrap errors with context.** `fmt.Errorf("reading config: %w", err)` is always better than returning the bare error. When the error surfaces, you want a stack of context, not a naked `permission denied`.

### Interfaces: Small or Not at All

Go interfaces are satisfied implicitly. A type that has the right methods satisfies the interface without declaring it. This is powerful and easy to misuse.

The boring rule: **define interfaces at the point of use, not the point of definition**. The package that *consumes* a dependency should define the interface it needs — usually one or two methods. The package that *provides* the implementation should not define an interface for itself.

```go
// Bad: large interface defined by the implementor
type FileSystem interface {
    Open(name string) (*os.File, error)
    Create(name string) (*os.File, error)
    Remove(name string) error
    Stat(name string) (os.FileInfo, error)
    ReadDir(name string) ([]os.DirEntry, error)
    // ...
}

// Good: small interface defined by the consumer
type FileOpener interface {
    Open(name string) (*os.File, error)
}
```

If your interface has more than three or four methods, it's probably doing too much. `io.Reader`, `io.Writer`, `io.Closer` — these are the model. One method, one responsibility.

### Goroutines: Earn Concurrency

Goroutines are cheap to start and expensive to reason about. The boring rule is to start with synchronous code and introduce concurrency only when you have a measured reason — a profiler output, a latency requirement, a queue that needs draining in parallel.

When you do reach for goroutines:

- Every goroutine needs a clear owner responsible for its lifetime.
- Use `context.Context` for cancellation. Don't invent your own signalling.
- Prefer channels for communication, mutexes for state protection — and know which you're doing.
- `sync.WaitGroup` for fan-out/fan-in. Don't implement it yourself.

The most common goroutine mistake isn't using them wrong — it's using them before you need them.

### Struct Composition Over Inheritance

Go has no inheritance. This is a gift. Composition via struct embedding is explicit, visible at the type definition, and doesn't create invisible coupling between types across a hierarchy.

```go
// Clear, visible, composable
type Logger struct {
    output io.Writer
    prefix string
}

type Server struct {
    Logger          // embedded — Logger's methods promoted
    addr   string
    mux    *http.ServeMux
}
```

Embedding should be used when you genuinely want to promote methods. Don't embed just to avoid passing a field around. The explicitness is a feature.

### Packages: Flat and Purposeful

The boring Go project has fewer packages than you think it needs. A package boundary should represent a genuine separation of concern — not a directory that felt like it deserved its own folder.

Common mistakes:
- `util`, `helpers`, `common` packages that become dumping grounds
- Splitting a small feature across multiple packages to feel organised
- Creating packages before you understand the boundaries

Start with one package. Split when there's a genuine reason — a dependency you want to keep out of the core, a piece you want to reuse across binaries, a boundary that needs a stable API.

### The Standard Library First

Before reaching for a dependency, ask whether the standard library does it. `net/http`, `encoding/json`, `database/sql`, `sync`, `context` — the standard library covers an enormous amount of ground and is maintained, tested, and stable. Third-party packages have transitive dependencies, versioning drift, and maintenance risk.

The boring rule: use the standard library until it demonstrably doesn't meet your needs. "Doesn't meet my needs" means a specific, measured gap — not "I've seen a library that would be more convenient."

---

## What to Resist

**Generics before necessity.** Go added generics in 1.18. They solve real problems for library authors. For application code, reach for them only when you have concrete duplication that generics would genuinely eliminate — not to make code feel more sophisticated. Most application code never needs them.

**Framework gravity.** The Go ecosystem has web frameworks, ORMs, dependency injection containers, and more. The standard library's `net/http` is production-grade. `database/sql` with a driver is sufficient for most database work. Frameworks add opinions, abstractions, and dependencies. Know what you're buying.

**Over-engineering project structure.** The "standard Go project layout" you'll find on GitHub — `/cmd`, `/internal`, `/pkg`, `/api` — is a convention for large projects and CLIs. A small service doesn't need this. Start flat. Grow into structure as the project earns it.

---

## The Go Proverbs (Selected)

Rob Pike's Go Proverbs are the canonical statement of boring Go. A few that map directly:

- *"Don't communicate by sharing memory; share memory by communicating."*
- *"The bigger the interface, the weaker the abstraction."*
- *"A little copying is better than a little dependency."*
- *"Clear is better than clever."*
- *"Errors are values."*

These aren't decorative. They encode decisions about how Go code should be written, and following them produces code that other Go programmers can read without friction.

---

## Summary

| Principle | Go Expression |
|-----------|--------------|
| Explicit over implicit | Error returns, not exceptions |
| Small interfaces | Define at the consumer, one or two methods |
| Earn concurrency | Synchronous first, goroutines when measured |
| Flat structure | Fewer packages, fewer abstractions |
| Standard library first | Reach for dependencies last |
| No surprises | No magic, no hidden control flow |
