# 🔝 The `head` Command

### ❓ What is it?

The `head` command outputs the first part of files. By default, it prints the first 10 lines of each file provided to it. It is primarily used to quickly inspect the beginning of a file, check log headers, or verify file content without opening the entire document.

---

### 🏳️ Options & Flags

`head [options] [file]`

| Flag                      | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| `-n`, `--lines <N>`       | Print the first `<N>` lines instead of the first 10.          |
| `-c`, `--bytes <N>`       | Print the first `<N>` bytes instead of lines.                 |
| `-q`, `--quiet`           | Never print headers giving file names (suppresses filenames). |
| `-v`, `--verbose`         | Always print headers giving file names.                       |
| `-z`, `--zero-terminated` | Line delimiter is NUL, not newline.                           |
| `--help`                  | Display help message and exit.                                |
| `--version`               | Output version information and exit.                          |