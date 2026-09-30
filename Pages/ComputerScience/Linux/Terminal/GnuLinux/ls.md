# 📂 The `ls` Command

### ❓ What is it?

The `ls` (list) command is the fundamental tool for displaying the contents of directories. It allows you to inspect file names, permissions, ownership, file sizes, and timestamps directly from your terminal.

---

### 🏳️ Options & Flags

`ls [options] [path]`

|Flag|Description|
|---|---|
|`-a`, `--all`|List all files, including hidden files (those starting with `.`).|
|`-A`, `--almost-all`|List all files except the `.` and `..` directories.|
|`-l`|Use long listing format (permissions, owner, size, date).|
|`-h`, `--human-readable`|Use with `-l` to show sizes in KB, MB, or GB.|
|`-t`|Sort by modification time (newest first).|
|`-r`, `--reverse`|Reverse the order of sorting.|
|`-R`, `--recursive`|List subdirectories recursively.|
|`-S`|Sort by file size (largest first).|
|`-1`|List one file per line.|
|`-d`, `--directory`|List the directory itself rather than its contents.|
|`-F`, `--classify`|Add indicators (`/` for dir, `*` for exec, etc.) to file names.|
|`-i`, `--inode`|Display the index number (inode) of each file.|
|`-U`|Do not sort; display files in order of the directory.|
|`--color`|Colorize the output based on file type.|