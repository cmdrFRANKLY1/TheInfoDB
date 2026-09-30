# 💾 The `lsblk` Command

### ❓ What is it?

The `lsblk` (List Block Devices) command is used to display information about all available block devices (such as hard drives, SSDs, partitions, LVM volumes, and flash drives) in your system. It formats this information in a tree-like view by default, making it significantly easier to understand the relationships between physical disks and their various partitions or mount points compared to older tools.

---

### 🏳️ Options & Flags

`lsblk [options]`

|Flag|Description|
|---|---|
|`-a`, `--all`|List all block devices, including empty devices and RAM disks.|
|`-f`, `--fs`|Display filesystem information (TYPE, FSTYPE, UUID, MOUNTPOINT).|
|`-o`, `--output <list>`|Define custom output columns (e.g., `-o NAME,SIZE,TYPE`).|
|`-p`, `--paths`|Print the full device path (e.g., `/dev/sda1` instead of `sda1`).|
|`-l`, `--list`|Output in a list format instead of the default tree view.|
|`-d`, `--nodeps`|Do not print slaves or holders (only top-level devices).|
|`-s`, `--inverse`|Display dependencies in inverse order (useful for finding the physical disk for a partition).|
|`-m`, `--perms`|Display output with ownership and permission information.|
|`--help`|Display a help message and exit.|