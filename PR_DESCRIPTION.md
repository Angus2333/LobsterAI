## feat: Add memory import/export support (Markdown & Image)

### Summary

Add import and export capabilities to the Memory settings page, allowing users to back up, migrate, and share their long-term memory entries.

### Motivation

Currently, users have no way to export or import their memory entries. This makes it difficult to:
- Back up memories before resetting the environment
- Migrate memories across devices
- Share curated memory sets with others

This PR adds three operations: **Export as Markdown**, **Export as Image (PNG)**, and **Import from file**, with a user-friendly import mode picker dialog.

### Changes

#### `src/renderer/components/Settings.tsx` (+367 lines)

**Export as Markdown**
- Fetches all memory entries via `coworkService.listMemoryEntries`
- Generates a standard `MEMORY.md` format (`- text` bullet lines) that is fully compatible with OpenClaw's memory file format
- Downloads as `lobsterai-memories-YYYY-MM-DD.md`

**Export as Image (PNG)**
- Renders a styled memory card using Canvas 2D API
- Includes title (🧠 LobsterAI Memories), entry count, date, divider, and LobsterAI watermark
- Supports HiDPI displays (`devicePixelRatio`)
- Auto-measures text width and truncates overflowing entries with ellipsis
- Downloads as `lobsterai-memories-YYYY-MM-DD.png`

**Import from file**
- Supports `.md`, `.markdown`, `.json`, and `.txt` file formats
- On file selection, shows a **modal dialog** letting the user choose between:
  - **Import as one entry** — imports the entire file content as a single memory
  - **Split into entries** — parses each list item (`- text`) as an individual memory entry
- Smart deduplication: normalizes text (lowercase, collapse whitespace) and skips entries that already exist
- Shows result summary: "Successfully imported X memories; Skipped Y duplicates"

**UI**
- Adds a compact toolbar with three buttons (Import / Export Markdown / Export Image) in the Memory management section, between the stats line and the search input
- Import mode picker modal follows existing modal design patterns (rounded card, dark mode support, backdrop dismiss)
- All buttons support loading/disabled states

#### `src/renderer/services/i18n.ts` (+30 lines)

- Added 15 i18n keys for both Chinese (`zh`) and English (`en`), covering:
  - Button labels (`coworkMemoryImport`, `coworkMemoryExportMarkdown`, `coworkMemoryExportImage`)
  - Error messages (`coworkMemoryExportEmpty`, `coworkMemoryExportFailed`, `coworkMemoryImportFailed`, `coworkMemoryImportInvalidFile`)
  - Success feedback with interpolation (`coworkMemoryImportSuccess`, `coworkMemoryImportDuplicate`)
  - Import mode dialog (`coworkMemoryImportModeTitle`, `coworkMemoryImportModeWhole`, `coworkMemoryImportModeSplit` with hints)

### Screenshots

> (Attach screenshots of the toolbar buttons and the import mode picker dialog here)

### Testing

- [x] `npx tsc --noEmit` — zero errors
- [x] `npm run build` — all three bundles (renderer, main, preload) built successfully
- [ ] Manual test: Export as Markdown with entries
- [ ] Manual test: Export as Markdown with no entries (shows error)
- [ ] Manual test: Export as Image with entries
- [ ] Manual test: Import `.md` file → choose "Import as one entry"
- [ ] Manual test: Import `.md` file → choose "Split into entries"
- [ ] Manual test: Import `.json` file (array of strings / objects)
- [ ] Manual test: Import file with duplicate entries (verify dedup)
- [ ] Manual test: Dark mode UI consistency

### Notes

- No new dependencies added — image export uses native Canvas 2D API
- No backend changes required — all logic uses existing `coworkService` methods
- Exported Markdown is fully compatible with the `MEMORY.md` format used by OpenClaw, enabling round-trip import/export
