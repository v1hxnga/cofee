# Recovery record — 16 October 2026

Recovered source of truth:
`/Users/vihangainduwara/Documents/Codex/2026-10-15/do-x20/work/noir-bean`

Destination:
`/Users/vihangainduwara/Desktop/NOIR BEAN`

Older Desktop exports are preserved in:
`/Users/vihangainduwara/Desktop/NOIR BEAN - Backup 2026-10-16`

The October 15 cinematic modules and imagery survived in the working project. Their modification times were around 22:23–22:41; the older Desktop HTML/source archive were from 14:26–14:28. The older HTML had no ritual section; the recovered source has all six phases. The recovered project was used throughout.

A pre-QA recovery snapshot is retained at:
`/Users/vihangainduwara/Documents/Codex/2026-10-15/do-x20/work/noir-bean-recovered-2026-10-16`

No Git repository exists in this checkout or its parent directories. There is no branch, commit, or Git diff. The retained v1 source and old Desktop ZIP were used for file comparisons. The original src/styles.css remains byte-identical to v1.

Recovery QA fixes: preserve scroll progress on resize; frame the cup for tablets; separate typography/caption on short desktop screens; hide the opening overlay in static mode; decode spaces correctly in build.mjs paths. Version is 1.1.1. See VALIDATION.md for checks and CHANGES.md for the file list.

The Desktop folder contains the complete recovered project, including src, assets, dist, installed node_modules, package manifests, build/verification scripts, documentation, screenshots, and a standalone NOIR BEAN.html. check.cjs is a retained historical diagnostic bundle, not a production entry point. The source ZIP omits machine-specific node_modules; npm ci restores dependencies on another computer.

Delivery completed: the Desktop project was built and run independently, with the workspace server stopped. The Desktop HTML includes all six phases. Source, assets, dependencies and export were verified after copying. Both older Desktop exports are intact in the backup folder.
