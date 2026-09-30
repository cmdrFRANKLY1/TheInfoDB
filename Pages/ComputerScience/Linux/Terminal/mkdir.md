# 📂 The `mkdir` Command

### ❓ What is it?

The `mkdir` (Make Directory) command is used to create new directories (folders) in the Linux filesystem. By default, it creates a single directory, but it can be configured to create nested directory structures efficiently.

---

### 🏳️ Options & Flags

`mkdir [options] [directory_name]`

| Flag              | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `-p`, `--parents` | Create parent directories as needed; no error if existing.         |
| `-v`, `--verbose` | Print a message for each directory created.                        |
| `-m`, `--mode`    | Set the file mode (permissions) for new directories (e.g., `755`). |
| `-Z`              | Set the SELinux security context of each created directory.        |
| `--help`          | Display help message and exit.                                     |
| `--version`       | Output version information and exit.                               |