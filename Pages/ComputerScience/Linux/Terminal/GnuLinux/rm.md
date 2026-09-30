# 🗑️ The `rm` Command

### ❓ What is it?

The `rm` (remove) command is used to delete files and directories from the filesystem. By default, it removes files, but it requires specific flags to remove directories. It is a powerful command that permanently deletes data—there is no "trash bin" when using the terminal.

---

### 🏳️ Options & Flags

`rm [options] [file/directory]`

|Flag|Description|
|---|---|
|`-f`, `--force`|Ignore nonexistent files and never prompt; delete without warning.|
|`-i`|Prompt before every removal.|
|`-I`|Prompt once before removing more than three files (safer than `-i`).|
|`-r`, `-R`, `--recursive`|Remove directories and their contents recursively.|
|`-d`, `--dir`|Remove empty directories.|
|`-v`, `--verbose`|Explain what is being done.|
|`--preserve-root`|Do not remove `/` (the root directory). Enabled by default.|
|`--no-preserve-root`|Do not treat `/` specially; dangerous if used with recursive flags.|
