# 🔌 The `umount` Command

### ❓ What is it?

The `umount` (unmount) command is used to detach a mounted filesystem from the Linux directory tree, effectively making the data at that location inaccessible. It is the necessary and safe procedure to follow before disconnecting storage devices, network shares, or partitions to ensure data integrity and prevent corruption.

_Note: The command is spelled `umount` (without the 'n')._

---

### 🏳️ Options & Flags

`umount [options] [directory|device]`

| Flag                | Description                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `-a`, `--all`       | Unmount all filesystems described in `/etc/mtab`.                                                        |
| `-l`, `--lazy`      | Detach the filesystem from the hierarchy immediately, and clean up references once it is no longer busy. |
| `-f`, `--force`     | Force an unmount (typically used for unreachable network filesystems like NFS).                          |
| `-r`, `--read-only` | If an unmount fails, attempt to remount the filesystem as read-only.                                     |
| `-v`, `--verbose`   | Provide verbose output detailing the unmount process.                                                    |
| `-t <type>`         | Limit the set of filesystems to the specified type (e.g., `ext4`, `nfs`).                                |
| `--help`            | Display a help message and exit.                                                                         |