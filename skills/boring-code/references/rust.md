# Boring Code Philosophy: Rust

## The Compiler Enforces Boring. Work With It.

Rust is the language where the boring principle is structurally enforced at compile time. The borrow checker forces you to think about ownership, lifetimes, and mutation explicitly — upfront, before the code runs. This is not a restriction to work around. It's the language making the right path the only path.

The boring principle in Rust therefore has a different character than in other languages. You can't avoid thinking about correctness — the compiler won't let you. The risk instead is in the abstractions you build *on top* of what the compiler requires: excessive trait bounds, premature generics, lifetimes that span the whole call tree, and clever use of the type system that proves something is correct but makes it incomprehensible.

Write code that satisfies the borrow checker in the most obvious way. Refine later when you have evidence that the obvious approach is insufficient.

---

## Core Rationale

### Ownership: Accept the Mental Model, Don't Fight It

The single most important thing about writing boring Rust is accepting the ownership model rather than fighting it with `Rc<RefCell<T>>`, `Arc<Mutex<T>>`, or `unsafe` to escape borrow checker errors you don't understand yet.

When the borrow checker rejects your code, that's usually information. Common causes:

- **You're holding a reference too long.** Clone the data you need instead of keeping the reference.
- **You need shared ownership.** That's what `Rc`/`Arc` are for — but it's often a design signal that ownership should be restructured.
- **You need interior mutability.** `Cell` for `Copy` types, `RefCell` for the rest — but if you're reaching for this frequently, the data model probably needs rethinking.

The boring path: restructure ownership so it's clear and linear where possible. A function that takes ownership, transforms it, and returns it is simpler than a function that borrows mutably and leaves state scattered across the call tree.

### Error Handling: `?` Is Enough for Most Code

Rust's `Result<T, E>` and the `?` operator are the boring error handling path. They make error propagation explicit and visible without the verbosity of explicit `match` on every call.

```rust
// Boring and correct
fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let contents = fs::read_to_string(path)?;
    let config = toml::from_str(&contents)?;
    Ok(config)
}
```

Use `?` freely within a function. At the boundary where you handle errors — `main`, a request handler, a task — match explicitly and decide what to do.

**Error types:** For application code, `anyhow` is the boring choice. It gives you context (`.context("reading config")`) and easy propagation without designing a full error type hierarchy. For library code, define your own error type — library users need to match on it, so `anyhow` is wrong there.

Don't use `.unwrap()` outside of tests and prototypes. Every `.unwrap()` in production code is a `panic!` waiting for the one input that makes it None or Err. Use `.expect("descriptive message")` at minimum, and that message should explain *why* this case should be impossible — it's documentation for when it turns out to be possible.

### Traits: Define What You Need, Not What You Can Imagine

Traits are Rust's abstraction mechanism and they're genuinely powerful. They're also easy to overuse.

The boring rule: define a trait when you have multiple concrete types that need the same behaviour, or when you need to abstract over something at a library boundary. Don't define a trait for a type that exists in one implementation and will only ever have one implementation.

```rust
// Probably unnecessary — there's only ever one EmailSender
trait EmailSender {
    fn send(&self, to: &str, body: &str) -> Result<()>;
}

// Worth it — you have multiple implementations and you want to swap them
trait Storage {
    fn get(&self, key: &str) -> Result<Option<Vec<u8>>>;
    fn set(&self, key: &str, value: &[u8]) -> Result<()>;
}
```

When you do write traits, keep them small. A trait with two or three methods is composable. A trait with ten methods is hard to implement and hard to mock.

**Trait objects vs generics:** `Box<dyn Trait>` (dynamic dispatch) is simpler than `<T: Trait>` (static dispatch with generics) in most application code. The performance difference is rarely measurable. Dynamic dispatch means less code, simpler function signatures, and no monomorphization. Reach for generics when you genuinely need the performance or when the zero-cost abstraction is load-bearing.

### Lifetimes: Push Them to the Edges

Explicit lifetime annotations are necessary in Rust, but they shouldn't permeate your codebase. When lifetimes appear deep in your application logic, that's usually a sign that you're holding borrowed data too long — clone it, own it, or restructure the code.

```rust
// Lifetimes creeping in — often a design smell in application code
struct Processor<'a> {
    config: &'a Config,
    data: &'a [Record],
}

// Clearer ownership — the processor owns what it needs
struct Processor {
    config: Config,
    data: Vec<Record>,
}
```

Lifetimes are appropriate and unavoidable in parsers, iterators, and code that genuinely needs to avoid allocation. In application business logic, they're usually a sign you should own the data instead.

### Async: Add It When You Need It

Rust's async/await is powerful and has a cost: function coloring (async functions can only be called from async contexts), more complex error messages, and a runtime dependency (`tokio`, `async-std`).

The boring rule: start synchronous. Add async when you have I/O concurrency that actually needs it — a web server handling many requests, a client making many network calls in parallel. A CLI tool, a data processing script, a single-threaded service — these often don't need async.

When you do use async:
- Pick one runtime and use it throughout. Mixing runtimes causes subtle bugs.
- `tokio` is the boring choice — it's the most widely used, the most documented, and the most compatible with the ecosystem.
- Use `tokio::spawn` for tasks that genuinely run concurrently. Don't spawn for sequential work.

### `unsafe`: It Requires Justification

`unsafe` in Rust exists because some things genuinely require stepping outside the ownership model — FFI, hardware access, performance-critical paths where you can prove safety the compiler can't. These cases are real and legitimate.

In application code, `unsafe` almost never belongs. If you're writing `unsafe` to work around a borrow checker error, that's the wrong direction. The boring rule: if you're considering `unsafe`, first ask whether a restructuring of ownership, a different data structure, or a different algorithm would make it unnecessary. Usually, it does.

---

## What to Resist

**Premature generics.** Making functions generic over types they only ever take one concrete form of adds complexity — longer function signatures, more complex error messages, less readable code — for no benefit.

**Newtype wrappers for everything.** The newtype pattern (wrapping a type in a single-field struct to give it a distinct type) is useful — `UserId(u64)` is better than a bare `u64` when you might confuse it with a `ProductId`. But wrapping every primitive adds boilerplate without always adding clarity. Use it where confusion is genuinely possible.

**Builder patterns by default.** Rust's builder pattern is common in library APIs and appropriate there. In application code, a struct literal or a constructor function is usually simpler.

**Overusing `Arc<Mutex<T>>` for shared state.** If most of your types end up wrapped in `Arc<Mutex<>>`, the design probably needs rethinking. Message passing via channels is often cleaner for concurrent data flow.

---

## The Crate Ecosystem

Rust's crate ecosystem is high quality but fast-moving. A few boring defaults that have proven themselves:

| Need | Boring Choice |
|------|--------------|
| Application error handling | `anyhow` |
| Library error handling | `thiserror` |
| Async runtime | `tokio` |
| HTTP client | `reqwest` |
| HTTP server | `axum` |
| Serialisation | `serde` |
| CLI | `clap` |
| Logging | `tracing` |

These aren't the only options. They're the ones with wide adoption, good documentation, and stable APIs — the ones where a new team member will find help when they need it.

---

## Summary

| Principle | Rust Expression |
|-----------|----------------|
| Accept the compiler | Work with the borrow checker, not around it |
| Explicit errors | `Result` + `?` everywhere; no `.unwrap()` in production |
| Small traits | Define at the point of need; dynamic dispatch by default |
| Own the data | Clone rather than accumulate lifetime annotations |
| Async when needed | Start sync; add async for genuine I/O concurrency |
| No `unsafe` in application code | If you need it, you need a justification |
