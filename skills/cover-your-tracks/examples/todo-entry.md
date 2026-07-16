## auth/middleware.go

- **What changed:** Added role-based access control to the JWT middleware.
- **What needs testing:** Verify that valid tokens with the new `roles` claim are accepted, and that requests without required roles are rejected with 403.
- **Suggested test form:** integration
- **Why it matters:** A regression here would allow unauthorised access to protected endpoints.
- **Date noted:** 2026-04-29
