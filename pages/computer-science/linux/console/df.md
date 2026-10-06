# df

The `df` command stands for **Disk Free**. It is a standard command-line utility in Unix, Linux, and other Unix-like operating systems used to display information about total, used, and available disk space across all mounted file systems.

# What df Is

When you need to know how much storage space is left on your hard drives, solid-state drives, or network shares, `df` is the primary tool for the job.

Unlike the `du` (disk usage) command—which recursively calculates the size of specific files and folders—`df` queries the operating system's file system tables to report instantaneous storage statistics for entire volumes. By default, it outputs raw measurements in 1024-byte blocks, making human-readable flags essential for everyday use.

# Common Options

While a basic execution provides a comprehensive report, `df` includes several powerful flags to format output, filter file system types, and improve readability.

## `-h` (Human-Readable)

By default, `df` reports sizes in 1-Kilobyte blocks. The `-h` flag converts these raw numbers into easy-to-read units, automatically scaling them to Kilobytes (K), Megabytes (M), Gigabytes (G), or Terabytes (T).

## `-T` (Type)

The `-T` flag adds a column displaying the file system type (such as `ext4`, `xfs`, `tmpfs`, or `ntfs`) for each mounted storage device, which is helpful when auditing mixed environments.

## `-i` (Inodes)

Instead of showing physical storage space (bytes), the `-i` flag reports **inode** usage. Inodes are underlying data structures that store file metadata; running out of inodes will prevent you from creating new files even if you have gigabytes of free disk space.

## `-t` (Type Filter)

If you only want to view storage statistics for a specific file system type (e.g., only `ext4` partitions), you can filter the output using `-t`.

## `-x` (Exclude Type)

Conversely, the `-x` flag allows you to exclude certain virtual or temporary file systems (like `tmpfs` or `devtmpfs`) to keep your output clean and focused on physical drives.

# Practical Examples

Here are the most common ways you will use `df` in the terminal to monitor storage capacity.

## The Human-Readable Overview

This is the standard way system administrators inspect overall disk health.

* **Command:** `df -h`

* **Result:** Outputs a clean table showing the file system path, total size, used space, available space, percentage used (`%use`), and the mount point for every active storage device.

## Including File System Types

Adding the type flag helps identify how different partitions are formatted.

* **Command:** `df -hT`

* **Result:** Displays the human-readable storage statistics along with an extra column indicating the specific file system format (e.g., `ext4`, `vfat`) of each volume.

## Checking Inode Consumption

When an application throws an error saying "No space left on device" despite `df -h` showing plenty of room, you must check inode limits.

* **Command:** `df -hi`

* **Result:** Displays total, used, and available inodes alongside usage percentages for every mounted volume.

## Inspecting a Specific File or Directory

You can pass a specific file path as an argument to see which underlying file system partition it lives on and how much space that specific volume has.

* **Command:** `df -h /var/log/syslog`

* **Result:** Returns storage data exclusively for the partition containing the system log file.

# Summary

The `df` command is an essential diagnostic tool for Linux system administration. Whether you are running a quick health check with `df -h`, auditing file system types with `-T`, or troubleshooting hidden limits using inode checks (`-df -hi`), mastering `df` ensures your infrastructure never runs unexpectedly out of space.

# Tags

* linux

* bash

* gnu

* command-line

* coreutils

* terminal

* file-system

* storage

* disk-space

* df

# Hyperlinks

| Word in Document | Official Source Hyperlink | 
| ----- | ----- | 
| df | https://www.gnu.org/software/coreutils/manual/html_node/df-invocation.html | 
| GNU Coreutils | https://www.gnu.org/software/coreutils/manual/ | 
| POSIX | https://pubs.opengroup.org/onlinepubs/9699919799/utilities/df.html | 
| Linux | https://www.kernel.org/ | 

# Mouse Over Information

| Word in Document | Mouse Over Information | 
| ----- | ----- | 
| arguments | Extra data, such as paths or filenames, provided to a command when it is run to tell it what to operate on. | 
| Bash | Bourne Again SHell; the default command-line interpreter for most GNU/Linux operating systems. | 
| blocks | Fixed-size blocks of data storage (traditionally 1024 bytes in standard Unix commands). | 
| command-line | A text-based interface used to interact with a computer operating system by typing commands. | 
| disk free | The literal translation of `df`; a utility used to display available and used storage space. | 
| disk usage | The measurement of how much storage capacity is currently being consumed on a drive. | 
| ext4 | Fourth Extended Filesystem; a widely used journaling file system for Linux distributions. | 
| file system | The logical structure and methods used by an operating system to store, organize, and retrieve files. | 
| flags | Options (usually preceded by a hyphen, like `-h`) passed to a command to modify its default behavior. | 
| Gigabytes | A unit of digital information storage, equal to 1,024 Megabytes. | 
| GNU Coreutils | The basic file, shell, and text manipulation utilities of the GNU operating system. | 
| hard drives | Non-volatile physical storage devices that store digital data on rapidly rotating magnetic platters. | 
| human-readable | Displaying measurements in easier-to-understand units like Megabytes or Gigabytes instead of raw bytes. | 
| inodes | Index nodes; data structures used by Unix-like file systems to store metadata about files (excluding names and data). | 
| Kilobytes | A unit of digital information storage, equal to 1,024 bytes. | 
| Linux | An open-source, Unix-like operating system kernel created by Linus Torvalds. | 
| Megabytes | A unit of digital information storage, equal to 1,024 Kilobytes. | 
| metadata | Data that provides information about other data, such as file permissions, ownership, and timestamps. | 
| mount point | A directory in the file system tree where a storage device or partition is made accessible. | 
| network shares | Storage drives or directories hosted on a remote computer and made accessible over a local network. | 
| ntfs | New Technology File System; a proprietary journaling file system developed by Microsoft. | 
| POSIX | Portable Operating System Interface; a family of standards specified for maintaining OS compatibility. | 
| solid-state drives | Modern non-volatile storage devices that use flash memory to store data with no moving parts (SSDs). | 
| storage space | The physical capacity of a drive available for holding files and applications. | 
| sysadmin | System administrator; an IT professional responsible for maintaining, configuring, and troubleshooting systems. | 
| terminal | A program that provides a text-based window and emulates a physical computer terminal to interface with a shell. | 
| Terabytes | A unit of digital information storage, equal to 1,024 Gigabytes. | 
| tmpfs | Temporary File System; a file system that stores files entirely in volatile RAM rather than permanent storage. | 
| Unix | A family of multitasking, multiuser computer operating systems dating back to the 1970s. | 
| xfs | A high-performance journaling file system created by Silicon Graphics, common in enterprise Linux systems. | 
