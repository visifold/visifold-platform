# Visifold Product Engineering Rules

These instructions apply to the entire `visifold-platform` repository.

## Ownership and authority

1. This project owns product and software implementation only.
2. Research projects are authoritative for equations, scientific interpretation, validated geometry, datasets, and research conclusions.
3. Research directories are upstream read-only sources. Never modify files under `02-research` unless the user explicitly authorizes it.
4. Prefer consuming research through explicit handoff documents and exported assets rather than relying on undocumented internal research files.
5. If direct cross-workspace access is available, use the research handoff in place rather than copying files unnecessarily.
6. If cross-workspace access is unavailable, report that clearly instead of silently duplicating or reconstructing research assets.
7. Never invent scientific values or geometry when an authoritative research source exists.
8. Product-specific transformations or optimized copies of research assets may live inside this repository, but their provenance must be documented.

## Product engineering practices

9. Prefer portable relative paths inside the product repository.
10. Important architectural decisions must be recorded in project files rather than relying on chat history.
11. Secrets, tokens, credentials, API keys, and recovery codes must never be stored in ordinary project files or committed to Git.
12. Avoid premature complexity.

## Intended delivery flow

```text
Research project
→ validated handoff/export
→ Visifold product implementation
→ public interactive visualization
```

The product implementation must preserve a clear provenance trail from each scientific input or derived product asset back to its validated research handoff.
