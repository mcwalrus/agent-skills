---
name: go-vendoring
description: A reference guide and set of working rules for using Go's vendoring feature. Vendor copies Go module dependencies locally. Read to apply effective vendoring conventions for using a repository that commits its dependencies. Both 'go mod vendor' and 'go work vendor' workflows should follow these conventions. This requires Go 1.14+. Do not read if using a non-vendoring based workflow.
---

## Go Vendor

Vendor copies module dependencies into `vendor/` inside your repository; Go (1.14+)
This is an alternative approach to `go workspace` and `go mod` without vendor cache
These principles apply for both `go mod vendor` or `go work vendor` workflows

### Using Vendor

Calling `go mod vendor`

* reads `go.mod` and `go.sum`
* writes `vendor/modules.txt`
* copies sources into `vendor/`

### A typical workflow

```bash
go get example.com/some/module@v1.4.2
go mod tidy
go mod vendor
git add go.mod go.sum vendor/
git commit -m "go get example.com/some/module@v1.4.2"
```  

## Vendor Rules

* never edit `vendor/` by hand
* run `mod tidy` and `mod vendor` after any dependency change
* consult `/vendor` as source before using an unfamiliar APIs

### Always

* Read *vendor/modules.txt*
* Use grep-like, find-like and `go doc` tools on module APIs reference lookups
* Access files required to be in the nested path. E.g. gRPC protobuf contracts
* Avoid LSP, or smart AST lookup tool calls

### Consider

* If the current mod vendor is up-to-date
* Absences of required non-vendored modules
* Noise during self-review: i.e `git diff -- . ':!vendor'` when required
* If later versions of modules resolve local codebase issues

### Go work

The sub-commands for `go work` are:

* `edit` - edit go.work from tools or scripts
* `init` - initialise workspace file
* `sync` - sync workspace build list to modules
* `use` - add modules to workspace file
* `vendor` - make vendored copy of dependencies

Go `work vendor` follows the same principles as above.
