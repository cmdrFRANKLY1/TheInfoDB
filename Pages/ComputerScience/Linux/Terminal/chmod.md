# 🔐 The `chmod` Command

### ❓ What is it?

`chmod` (Change Mode) is a command-line utility used to modify the access permissions of file system objects (files and directories). It controls who can **read** (r), **write** (w), and **execute** (x) files, allowing you to secure your system by restricting or granting access to specific users, groups, or the public.

---

### 🏳️ Options & Flags

`chmod [options] mode file`

|Flag|Description|
|---|---|
|`-R`, `--recursive`|Apply permissions changes recursively to directories and their contents.|
|`-v`, `--verbose`|Output a diagnostic for every file processed.|
|`-c`, `--changes`|Similar to verbose, but only reports when a change is actually made.|
|`-f`, `--silent`, `--quiet`|Suppress most error messages.|
|`--reference=<file>`|Use the mode of a specific reference file instead of a mode value.|
|`--help`|Display a help message and exit.|
|`--version`|Output version information and exit.|