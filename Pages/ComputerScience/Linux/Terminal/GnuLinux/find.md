# 🔍 The `find` Command

### ❓ What is it?

The `find` command is a powerful utility used to search for files and directories in a directory hierarchy based on criteria such as name, size, type, ownership, and modification time. Unlike simpler search tools, `find` can also execute commands on the files it locates, making it an essential tool for system administration and file management.

---

### 🏳️ Options & Flags

`find [path] [expression]`

|Flag|Description|
|---|---|
|`-name <pattern>`|Search for files by name (case-sensitive).|
|`-iname <pattern>`|Search for files by name (case-insensitive).|
|`-type <type>`|Restrict to type (`f` for file, `d` for directory, `l` for symbolic link).|
|`-mtime <n>`|Files modified `n` days ago.|
|`-size <n>`|Files with size `n` (e.g., `+10M` for greater than 10MB).|
|`-user <name>`|Files owned by the specified user.|
|`-perm <mode>`|Files with specific permission bits (e.g., `644`).|
|`-maxdepth <n>`|Limit the search to `n` levels of directory depth.|
|`-exec <cmd> {} \;`|Execute a command on each file found.|
|`-delete`|Delete files found (use with extreme caution).|
|`-empty`|Search for empty files or directories.|
|`-not <expr>`|Invert the search condition.|