# 📜 The `less` Command

### ❓ What is it?

`less` is a terminal pager utility used to view the contents of large text files one screen at a time. Unlike `cat`, which outputs the entire file at once, `less` loads only what is necessary into memory, making it highly efficient. It allows for bi-directional navigation (scrolling up and down), searching for strings, and jumping to specific lines.

---

### 🏳️ Options & Flags

`less [options] [file]`

| Flag           | Description                                                                           |
| -------------- | ------------------------------------------------------------------------------------- |
| `-N`           | Displays line numbers for each line.                                                  |
| `-S`           | Clips (chops) long lines instead of wrapping them.                                    |
| `-i`           | Performs a case-insensitive search (unless uppercase letters are used in the search). |
| `-I`           | Performs a case-insensitive search (always).                                          |
| `-F`           | Automatically exits if the entire file fits on the first screen.                      |
| `-X`           | Leaves the file contents on the screen after exiting the pager.                       |
| `-f`           | Forces the opening of non-regular files (like binary files).                          |
| `-g`           | Highlights only the current match during a search.                                    |
| `-n`           | Suppresses line numbers (improves performance).                                       |
| `-p <pattern>` | Starts the file at the first occurrence of the specified pattern.                     |
| `+<number>`    | Starts the file at the specified line number.                                         |
| `-?`           | Displays a help screen with all internal keyboard commands.                           |