# 📦 The `pacman` Command

### ❓ What is it?

`pacman` (package manager) is the primary package management utility for Arch Linux and its derivatives (such as Manjaro and EndeavourOS). It combines a simple binary package format with an easy-to-use build system (`makepkg`). `pacman` is designed to be efficient, handling package installation, upgrades, removal, and dependency resolution with a focus on simplicity and high performance.

---

### 🛠️ Operations & Flags

Unlike many other Linux commands, `pacman` syntax is centered around an **Operation** (the uppercase letter) followed by **Modifiers** (lowercase letters). The basic structure is: `sudo pacman <operation> <modifiers> <package(s)>`.

| Operation | Description                                                                           |
| --------- | ------------------------------------------------------------------------------------- |
| `-S`      | **Sync:** Install or upgrade packages from the remote repositories.                   |
| `-R`      | **Remove:** Delete packages from the system.                                          |
| `-Q`      | **Query:** Query the local package database (for searching installed files/packages). |
| `-U`      | **Upgrade/Install:** Install a local package file (e.g., `pkg.tar.zst`).              |
| `-D`      | **Database:** Modify the local package database.                                      |