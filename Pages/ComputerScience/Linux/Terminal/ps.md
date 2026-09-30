# 📊 The `ps` Command

### ❓ What is it?

`ps` (Process Status) is a command-line utility used to display information about active processes currently running on the system. It provides a snapshot of your system's activity, allowing you to identify process IDs (PIDs), CPU usage, memory consumption, and the commands that initiated them.

---

### 🏳️ Options & Flags

`ps [options]`

| Flag           | Description                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| `-e`           | Select all processes.                                                                                 |
| `-f`           | Full-format listing (includes UID, PPID, C, STIME, TTY, TIME, CMD).                                   |
| `-u <user>`    | Select processes associated with a specific user.                                                     |
| `-p <pid>`     | Display information for a specific Process ID.                                                        |
| `-aux`         | A classic combination: shows all processes for all users, including those not attached to a terminal. |
| `--forest`     | Show the process hierarchy as an ASCII art tree.                                                      |
| `-o <format>`  | Custom output format; specify columns (e.g., `-o pid,user,cmd`).                                      |
| `--sort <col>` | Sort by specific column (e.g., `--sort -cpu` or `--sort -mem`).                                       |
| `-C <cmd>`     | Select processes by command name.                                                                     |
| `-T`           | Show threads for the processes.                                                                       |
| `--help`       | Display help message and exit.                                                                        |