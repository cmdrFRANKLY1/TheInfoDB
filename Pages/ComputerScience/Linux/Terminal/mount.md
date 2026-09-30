# 🔗 The `mount` Command

### ❓ What is it?

The `mount` command is a fundamental utility in Linux used to attach a storage device or filesystem to the existing directory tree, making it accessible to the operating system and users. By default, Linux systems have a single root directory (`/`); `mount` allows you to take a specific partition, disk, CD/DVD, or network share and map it to a specific directory (known as a **mount point**).

---

### 🏳️ Options & Flags

`mount [options] [device] [directory]`

| Flag                 | Description                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| `-t <type>`          | Specify the filesystem type (e.g., `ext4`, `xfs`, `vfat`, `nfs`).                |
| `-o <options>`       | Specify mount options (e.g., `rw` for read-write, `ro` for read-only, `noexec`). |
| `-a`                 | Mount all filesystems described in `/etc/fstab`.                                 |
| `-r`, `--read-only`  | Mount the filesystem as read-only.                                               |
| `-w`, `--read-write` | Mount the filesystem as read-write (default).                                    |
| `-v`, `--verbose`    | Be verbose (useful for troubleshooting).                                         |
| `-L <label>`         | Mount the partition that has the specified label.                                |
| `-U <uuid>`          | Mount the partition that has the specified UUID.                                 |
| `-n`                 | Mount without writing to `/etc/mtab` (useful for read-only root).                |
| `--bind`             | Remount a part of the file hierarchy somewhere else.                             |