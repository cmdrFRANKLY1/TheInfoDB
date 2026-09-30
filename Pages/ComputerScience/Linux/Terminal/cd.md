# 📂 The `cd` Command

### ❓ What is it?

`cd` (Change Directory) is a shell builtin used to switch the current working directory to a specified path. It is the fundamental command for navigating the Linux filesystem structure.

---

### 🏳️ Options & Flags

`cd [options] [path]`

| Flag/Argument | Description                                                                      |
| ------------- | -------------------------------------------------------------------------------- |
| `-P`          | Use physical directory structure (avoids symbolic links, resolves to real path). |
| `-L`          | Follow symbolic links (default behavior).                                        |
| `-`           | Switch to the previous directory you were just in.                               |
| `~`           | Switch to the current user's home directory.                                     |
| `..`          | Move up one level (to the parent directory).                                     |
| `/`           | Move to the root directory.                                                      |
| `.`           | Remain in the current directory (mostly used in script paths).                   |
