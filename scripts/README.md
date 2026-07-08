# scripts/ — DEPRECATED (Phase 2)

Tools in this directory have been moved to **[pine-semantic-platform](https://github.com/akhmfz/pine-semantic-platform) v2.0+**.

## Migration

Requirement: `pip install` from GitHub or local path.

```bash
# Install from GitHub (v2.0+)
pip install git+https://github.com/akhmfz/pine-semantic-platform.git@v2.0.0

# Or local development
pip install -e /path/to/pine-semantic-platform

# Now CLI commands are available globally:
pine-extract --project-dir /path/to/my-project
pine-query search "pattern" --format table
pine-context "explain scoring" --profile review
pine-validate --workspace /path/to/my-project
```

Or via Python module:

```bash
python -m scripts.extract_ast --project-dir .
python -m scripts.pine_query search "pattern"
```

## Schedule

- **Phase 1** (completed): Deprecation notice. Files still here, still work.
- **Phase 2** (current): Use `pine-*` CLI from installed platform. Direct `python scripts/*.py` deprecated.
- **Phase 3** (future): Files removed. Use platform exclusively.

## Compatibility

| papan-gerak | pine-semantic-platform |
|-------------|----------------------|
| v1.2+       | v2.0.x               |

See [pine-semantic-platform](https://github.com/akhmfz/pine-semantic-platform) for full documentation.
