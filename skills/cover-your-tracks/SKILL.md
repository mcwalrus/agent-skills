---
name: cover-your-tracks
description: >
  Ensure every code change leaves behind tests, integration checks, or at minimum
  a captured TODO for later validation. Use after /iterative-changes or when the
  user says "cover your tracks", "add tests for this", "make sure this is tested",
  or "what tests do we need". Probes the codebase for existing test
  infrastructure, selects the appropriate test form (unit, integration,
  contract, property-based, snapshot), writes or updates tests, and commits them
  alongside the change. Do NOT trigger for test-driven development from scratch
  — use planning skills for that. Do NOT trigger for code review or security
  auditing — use review or security-review for those.
user-invocable: true
---

# Cover Your Tracks

After any code change — especially one produced by /iterative-changes — ensure
the change is validated by tests, integration checks, or at minimum a formal
TODO captured for future review. Be pragmatic: prefer the test form the codebase
already supports over introducing new frameworks. If no test infrastructure
exists, leave structured notes that a future session or human reviewer can act
on without re-discovering the gap.

## Values

- **Verification over ceremony.** A passing test in the existing framework
  beats a perfect test in a framework you just invented.
- **Capture over forget.** A TODO in a known location beats an unspoken
  assumption that testing is "obvious."
- **Local over global.** Tests that run in the project's existing CI beat
  tests that require manual steps or new infrastructure.

## Constraints

- Never introduce a test framework the project does not already use.
- Never skip producing output. If you cannot write tests, you must produce TODOs.
- Never test implementation details that are likely to change — test the
  contract, not the internals.
- Never delete existing tests without replacing their coverage.
- Only test changes the user has indicated or that are clear from the session
  context. Do not generate tests for untouched code.

## Workflow

1. **Assess the change.** Read the diff or the files the user indicates were
   modified. Understand what behaviour changed, what contracts were affected,
   and what could regress.

2. **Probe test infrastructure.** Determine what test frameworks and patterns
   the project already uses:
   - Look for test directories (`tests/`, `test/`, `__tests__/`, `spec/`)
   - Read existing test files to infer framework and conventions
   - Check for test runners in `package.json`, `Cargo.toml`, `go.mod`,
     `pyproject.toml`, `Makefile`, `justfile`, or CI config
   - Note the project's preferred test types (unit, integration, e2e,
     property-based, contract, snapshot)

3. **Select test form.** Choose the lowest-cost test type that validates the
   change:
   - **Unit tests** — for isolated logic, pure functions, stateless transforms
   - **Integration tests** — for component interactions, API contracts, database
     or network boundary behaviour
   - **Contract tests** — for schema validation, API spec conformance
   - **Property-based tests** — for functions with clear invariants and
     generatable inputs
   - **Snapshot tests** — for output-heavy code where exact output matters
   - **TODO notes** — when no infrastructure exists or the change is
     architectural and not yet testable

4. **Write tests or TODOs.**
   - If tests: follow the project's existing patterns (naming, structure,
     assertions, mocking approach). Add tests to the appropriate existing test
     file or create a new one if the change introduces a new module.
   - If TODOs: write them to a single, known location. Prefer the project's
     existing issue tracker or TODO file. If none exists, create
     `TODO_TESTS.md` in the project root. Each TODO must state:
     what needs testing, why it matters, and what form of test would be
     appropriate once infrastructure exists.

5. **Run the tests.** Execute the project's test command and verify your new
   tests pass. Fix any failures before proceeding. Be reasonable about runtime —
   if the full suite takes longer than a few minutes, run only the tests you
   added or a targeted subset.

6. **Commit together.** Stage the tests or TODOs alongside the code change they
   validate. Do not leave tests in a separate commit from the change they cover.

## Output Format

- **Tests:** New or updated test files in the project's existing test
  directory structure. Must include at least one assertion per test case.
- **TODOs:** A structured entry in the project's chosen TODO location or
  `TODO_TESTS.md` in the project root. Each entry follows this format:
  ```
  ## [Component or File Changed]

  - **What changed:** [brief description]
  - **What needs testing:** [specific behaviour to validate]
  - **Suggested test form:** [unit / integration / property / snapshot / other]
  - **Why it matters:** [risk of regression or correctness gap]
  ```

## Transitions

- If the user wants to refine the change further, return to /iterative-changes.
- If the tests reveal a bug in the original change, fix the change first, then
  return to this skill.
- If the user wants a security review of the tests or the change, invoke
  /security-review.
- If you discover the scope is unclear, the change spans multiple services, or
  the user has not indicated what to test, stop and ask: "What change should I
  cover?"
