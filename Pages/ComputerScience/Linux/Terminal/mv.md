# 🚚 The `mv` Command

### ❓ What is it?

The `mv` (move) command is used to move files or directories from one location to another. It is also the standard way to rename files and directories, as renaming is effectively moving a file to the same location with a different name.

---

### 🏳️ Options & Flags

`mv [options] [source] [destination]`

| Flag                  | Description                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| `-i`, `--interactive` | Prompt before overwriting an existing destination file.                                                |
| `-f`, `--force`       | Move without prompting, overwriting existing files silently.                                           |
| `-n`, `--no-clobber`  | Do not overwrite an existing file.                                                                     |
| `-v`, `--verbose`     | Explain what is being done (shows files as they are moved).                                            |
| `-u`, `--update`      | Move only when the source file is newer than the destination file, or when the destination is missing. |
| `-b`, `--backup`      | Create a backup of each existing destination file before overwriting.                                  |
| `--help`              | Display help message and exit.                                                                         |
| `--version`           | Output version information and exit.                                                                   |