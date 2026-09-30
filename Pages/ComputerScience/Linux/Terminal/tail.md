---
tags:
  - linker-exclude
---
# 🔚 The `tail` Command

### ❓ What is it?

The `tail` command is the counterpart to `head`; it outputs the last part of files. By default, it prints the last 10 lines of each file. It is most frequently used to monitor log files in real-time by using the "follow" mode to see new entries as they are written to the file.

---

### 🏳️ Options & Flags

`tail [options] [file]`

| Flag                | Description                                                                             |
| ------------------- | --------------------------------------------------------------------------------------- |
| `-n`, `--lines <N>` | Output the last `<N>` lines instead of the last 10.                                     |
| `-f`, `--follow`    | Output appended data as the file grows (real-time monitoring).                          |
| `-c`, `--bytes <N>` | Output the last `<N>` bytes instead of lines.                                           |
| `-F`                | Same as `--follow=name`, but also tracks if the file is recreated (e.g., log rotation). |
| `-q`, `--quiet`     | Never print headers giving file names (suppresses filenames).                           |
| `-v`, `--verbose`   | Always print headers giving file names.                                                 |
| `--pid=<PID>`       | With `-f`, terminate the tail process after the process ID `<PID>` dies.                |
| `--retry`           | Keep trying to open a file if it is inaccessible.                                       |
| `--help`            | Display a help message and exit.                                                        |