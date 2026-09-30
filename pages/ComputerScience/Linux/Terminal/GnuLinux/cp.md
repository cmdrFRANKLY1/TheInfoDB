# 📋 The `cp` Command

### ❓ What is it?

The `cp` (copy) command is used to copy files and directories from a source location to a destination location. It creates an exact duplicate of the source file or directory tree at the specified destination.

---

### 🏳️ Options & Flags

`cp [options] [source] [destination]`

| Flag                      | Description                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `-r`, `-R`, `--recursive` | Copy directories and their contents recursively.                                                                   |
| `-i`, `--interactive`     | Prompt before overwriting an existing file.                                                                        |
| `-f`, `--force`           | Force overwrite; if destination file cannot be opened, remove it and try again.                                    |
| `-v`, `--verbose`         | Explain what is being done (shows files as they are copied).                                                       |
| `-a`, `--archive`         | Archive mode; preserves file attributes (permissions, ownership, timestamps) and handles symbolic links correctly. |
| `-u`, `--update`          | Copy only when the source file is newer than the destination file, or when the destination file is missing.        |
| `-p`, `--preserve`        | Preserve specified attributes (mode, ownership, timestamps).                                                       |
| `-l`, `--link`            | Create hard links instead of copying files.                                                                        |
| `-n`, `--no-clobber`      | Do not overwrite an existing file.                                                                                 |