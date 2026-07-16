# Python Commands

## Allow
- `Bash(pytest *)`
- `Bash(uv run pytest *)`
- `Bash(ruff check *)`
- `Bash(ruff format --check *)`
- `Bash(black --check *)`
- `Bash(mypy *)`
- `Bash(pytest --collect-only *)`
- `Bash(python -m pytest *)`
- `Bash(python -m unittest *)`

## Ask
- `Bash(uv add *)`
- `Bash(uv remove *)`
- `Bash(uv sync *)`
- `Bash(pip install *)`
- `Bash(pip uninstall *)`
- `Bash(pip3 install *)`
- `Bash(python setup.py install *)`
- `Bash(ruff format *)` (without --check)
- `Bash(black *)` (without --check)

## Deny
- `Bash(pip install --user *)` (can pollute global)
- `Bash(sudo pip *)`
