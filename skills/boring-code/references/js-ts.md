# Boring Code Philosophy: JavaScript / TypeScript

## The Ecosystem Works Against You

JavaScript and TypeScript are where the boring principle is hardest to follow, because the ecosystem is specifically designed to make new things feel necessary. New frameworks, new bundlers, new meta-frameworks, new state management patterns, new testing philosophies — the churn is structural. New tools arrive before the old ones are fully understood.

The boring principle here requires active resistance, not just discipline. You are swimming against a current. The current is composed of conference talks, newsletter hype, framework release announcements, and the social pressure to use what everyone else is using right now.

Fight it.

---

## Core Rationale

### TypeScript: Use It, But Don't Worship It

TypeScript is the correct default for any project of meaningful size or duration. Types at boundaries, types in shared code, types on function signatures — these pay back in caught errors, refactoring confidence, and documentation.

But TypeScript's type system is Turing-complete, and that's a warning, not an invitation. The boring rule: use types to express your domain clearly, not to prove things with the type system that don't need proving.

```typescript
// Good: types express domain clearly
type UserId = string;
type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  userId: UserId;
  status: OrderStatus;
  items: OrderItem[];
}

// Too clever: conditional types for application-level logic
type DeepReadonly<T> = T extends (infer U)[]
  ? DeepReadonlyArray<U>
  : T extends object
  ? DeepReadonlyObject<T>
  : T;
```

If you're writing conditional types in application code, ask whether a simpler type would do the job. Generic utility types from the standard library (`Partial`, `Required`, `Pick`, `Omit`, `Record`) cover most of what application code needs.

**Avoid `any`.** It exists. Use it at genuine boundaries where you can't know the type — raw JSON from an external API, legacy JavaScript you're wrapping. Don't use it to escape a type error you don't want to solve. `unknown` is almost always better than `any` — it forces you to narrow the type before using it.

**`strictNullChecks` is non-negotiable.** Turn it on. If it reveals hundreds of errors in an existing codebase, that's information — those are bugs or unhandled cases, not type system pedantry.

### Error Handling: Be Explicit, Not Silent

JavaScript's async/await makes it easy to forget error handling. An `await` with no `try/catch` propagates rejections silently until something handles them — or doesn't.

```typescript
// Bad: errors silently propagate or get swallowed
const data = await fetchUser(id);

// Good: handle at the right level
try {
  const data = await fetchUser(id);
} catch (error) {
  if (error instanceof NotFoundError) {
    return null;
  }
  throw error; // re-throw what you don't handle
}
```

On the Node.js side: always handle `unhandledRejection`. In the browser: always handle uncaught promise rejections. Unhandled rejections are the `catch Exception: pass` of JavaScript.

For libraries and APIs that return errors frequently, consider the Result pattern — returning `{ ok: true, value: T } | { ok: false, error: E }` instead of throwing. This makes error paths explicit at the call site without requiring try/catch. Libraries like `neverthrow` implement this, but you can write it yourself in ten lines.

### Framework Gravity: The Most Dangerous Force

The JavaScript ecosystem has more frameworks per square metre than any other ecosystem. Web frameworks, state management, data fetching, form handling, animation — all fragmented, all competing, all with passionate advocates.

The boring defaults:
- **React** remains the safe choice for component-based UI. It has the widest ecosystem, the most documentation, and the most people who can maintain it.
- **Next.js** for React applications that need routing and server rendering. It's opinionated in ways that save you from making bad decisions.
- **Node.js + Express** or **Fastify** for backend services. Simple, well-understood, enormous ecosystem.
- **Vite** for bundling. Fast, simple configuration, good defaults.

The boring rule on frameworks: pick one you understand and can maintain. The second-best framework you understand thoroughly is better than the best framework you're still figuring out.

**Don't rewrite for a new framework.** The framework that looked boring last year usually still works. The cost of a rewrite is always higher than the estimate, and the benefit of the new framework is always lower.

### State Management: Start with What the Platform Gives You

The history of React state management is a history of people solving a problem they didn't have yet. Context API, Redux, MobX, Zustand, Jotai, Recoil, Valtio — the list is long.

The boring path: start with `useState` and `useReducer`. Add context when prop drilling becomes genuinely painful. Add a state management library only when you have a concrete problem that local state and context can't solve — usually when you have truly global state that changes frequently and needs to update many components efficiently.

Most applications never need more than `useState`, `useReducer`, and context.

For server state specifically — data fetched from an API — use a fetching library (`TanStack Query`, `SWR`). These solve the cache/refetch/loading state problem that you will otherwise solve badly yourself three times before getting right.

### `null` and `undefined`: Pick One, Use Consistently

JavaScript has two "nothing" values. TypeScript exposes both. The boring rule is to pick `null` for intentional absence (a field that has no value) and `undefined` for unset (a field that was never provided), and to be consistent throughout a codebase.

The optional chaining operator (`?.`) and nullish coalescing (`??`) are the boring alternatives to verbose null checks:

```typescript
// Verbose but explicit
const city = user && user.address && user.address.city
  ? user.address.city
  : "Unknown";

// Concise and clear
const city = user?.address?.city ?? "Unknown";
```

Don't use `!` (non-null assertion) liberally. It's a signal to TypeScript that says "trust me, this isn't null" — which, like a comment that says "this never fails," is exactly where it does.

### Async: Promises over Callbacks, `async/await` over Chains

Callback-style async is legacy. Avoid it in new code except where an API requires it (event emitters, some Node.js streams APIs). Promisify those APIs at the boundary and use them with `async/await` internally.

Long `.then().catch().finally()` chains are harder to read than equivalent `async/await` code. Use `async/await`.

```typescript
// Harder to read
function loadUser(id: string): Promise<User> {
  return fetchUser(id)
    .then(raw => parseUser(raw))
    .then(user => enrichUser(user))
    .catch(err => handleError(err));
}

// Easier to read
async function loadUser(id: string): Promise<User> {
  try {
    const raw = await fetchUser(id);
    const user = parseUser(raw);
    return await enrichUser(user);
  } catch (err) {
    handleError(err);
    throw err;
  }
}
```

`Promise.all` for concurrent independent operations. `Promise.allSettled` when you want results even if some fail. Don't `await` in a loop when you could run things in parallel.

### The Dependency Problem

JavaScript has the worst dependency problem of any mainstream ecosystem. `node_modules` directories contain thousands of packages. A single `npm install` in a new project can introduce hundreds of transitive dependencies you've never heard of.

The boring rules:
- **Audit your dependencies.** Know what you're importing and why.
- **`npm audit` in CI.** Not optional.
- **Avoid tiny single-function packages.** `left-pad` is the cautionary tale. `is-odd` has 500,000 weekly downloads and is 10 lines of code. Write the 10 lines.
- **Lock your versions.** `package-lock.json` or `yarn.lock` — commit it, use it.
- **Prefer zero-dependency libraries** for small utilities. If a library brings its own ecosystem, understand why.

---

## What to Resist

**"We should rewrite in [new framework]."** No. Until the current framework is genuinely blocking you, the answer is no.

**Meta-programming with Proxy, Symbol, and Reflect.** These exist for framework authors. Application code that uses them is application code that surprises its readers.

**Barrel files (`index.ts` that re-exports everything).** They feel organised. They create circular dependency problems, make tree-shaking harder, and slow down TypeScript's language server. Import from the specific file.

**Classes for everything.** JavaScript inherited class syntax from Java aesthetics. Module-level functions and plain objects are often simpler. Use classes when you need `this`-bound methods, inheritance, or implementing an interface with a constructor. Not as a default.

---

## Summary

| Principle | JS/TS Expression |
|-----------|-----------------|
| Types at boundaries | TypeScript strict mode; `unknown` not `any` |
| Explicit errors | `try/catch` at the right level; no swallowed rejections |
| Resist framework churn | Pick understood tools; don't rewrite for new ones |
| State management floor | `useState` first; libraries when you've earned them |
| Async clearly | `async/await` over chains; parallel when truly concurrent |
| Dependency discipline | Know what you install; lock versions; audit in CI |
