# 📍 The `pwd` Command

### ❓ What is it?

`pwd` (Print Working Directory) is a shell builtin that prints the full, absolute path of the directory you are currently in. It starts from the root directory (`/`) and lists the entire path to your location, which is helpful when you lose track of your depth within the file system hierarchy.

---

### 🏳️ Options & Flags

`pwd [option]`

| Flag               | Description                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `-L`, `--logical`  | Print the path using the logical environment variable (includes symbolic links). This is the **default**. |
| `-P`, `--physical` | Print the physical path, resolving all symbolic links to their actual location on the disk.               |
| `--help`           | Display a help message and exit.                                                                          |
| `--version`        | Output version information and exit.                                                                      |