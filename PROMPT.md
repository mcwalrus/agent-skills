Develop a lightwieght tool called agent-skills that lets you define your working style, conventions, and preferences once across multiple agent skills and rules formats. That is to automatically keep every AI coding agent you use in sync with that single definition. Instead of maintaining separate agents configs for each tool, you write your skills in one place and agent-skills handles translating and distributing them to wherever they need to go.

Requirements:
* Provide as a npm node module.
* I only work with cursor and claude for agent skills / rules.
* I want a configuration format and guide to follow. This should be readable for other agents (i.e skills for using this tool).
* I want there to be some checksum / sync operation which can be enforced for ci integration
* Use typescript and enforce CI checks throughout development.

Specifics:
* If a required configuration file is used, have it set as `~/.agent-skills/config.json`.
* A `agent-skills init` should be configurable to setup the directory for agent skills.
* Some help article should be possible to explain the difference between different rule systems.
* Use the latest practices for agent rule / skills / suggestions files.
* By default, define skills under `~/.agent-skills/skills` and rules under `~/.agent-skills/rules` and suggestions under `~/.agent-skills/suggestions`.
* Provide a minimal config / style approach.

Usage Command
* Node dev dependency
    * npm install --save-dev agent-skills
* Global (non-Node projects)
    * npm install -g agent-skills
* One-off / no install
    npx agent-skills

For the sync/checksum CI enforcement:
* Fail CI with an error message listing what's out of sync

What should agent-skills init set up?
* Just the ~/.agent-skills/ directory structure and a starter config

For the "help article on rule systems" — what format should this take?
* A markdown file generated into the project i.e. ~/.agent-skills/GUIDE.md on `init --guide`
* A agent-skills help CLI command that prints to stdout

Scope of the translators/adapters for Cursor and Claude:
* Smart translation — transform the source format into each tool's native format

What is the primary output format for skills/rules?
* A single unified markdown file per skill according to the agent setup.

How should the sync/checksum work?
* Hash the source files and compare against generated output files in the project
* A lockfile (like agent-skills.lock) that tracks last-synced state

What is the target scope for the initial release?
* Full: init, sync, check, help, and validate commands

How should skills, rules, and suggestions differ semantically?
* *Skills = how-to behaviors, Rules = hard constraints, Suggestions = soft preferences`

I have included a few scripts from a prototype I have used on a previous attempt if useful.

package.json
"generate-skills": "node generate-skills.js"

agent-skills.md: this was the previous attempt of syncing skills.