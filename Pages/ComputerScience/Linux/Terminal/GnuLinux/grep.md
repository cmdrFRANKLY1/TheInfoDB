# 🔍 The `grep` Command

### ❓ What is it?

`grep` (Global Regular Expression Print) is a powerful command-line utility used for searching text within files or input streams. It scans lines of text for a specified pattern and outputs the lines that match. It is an essential tool for log analysis, filtering terminal output, and searching for specific strings in large codebases.

---

### 🏳️ Options & Flags

`grep [options] [pattern] [file]`

|Flag|Description|
|---|---|
|`-i`, `--ignore-case`|Ignore case distinctions in both pattern and data.|
|`-v`, `--invert-match`|Invert the sense of matching (select non-matching lines).|
|`-r`, `-R`, `--recursive`|Read all files under each directory recursively.|
|`-n`, `--line-number`|Prefix each line of output with its line number in the file.|
|`-l`, `--files-with-matches`|Print only the names of files that contain a match.|
|`-w`, `--word-regexp`|Select only lines containing matches that form whole words.|
|`-c`, `--count`|Print only a count of matching lines per file.|
|`-E`, `--extended-regexp`|Interpret pattern as an extended regular expression (allows `+`, `?`, `|
|`-o`, `--only-matching`|Print only the matched parts of a matching line.|
|`-A <num>`, `--after-context`|Print `<num>` lines of trailing context after each match.|
|`-B <num>`, `--before-context`|Print `<num>` lines of leading context before each match.|
|`-q`, `--quiet`|Suppress all normal output; exit with status 0 if any match is found.|