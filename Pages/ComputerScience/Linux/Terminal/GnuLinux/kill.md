# 💀 The `kill` Command

### ❓ What is it?

The `kill` command is a built-in utility used to send signals to processes. Despite its name, it is not strictly for "killing" (terminating) processes; it is primarily used to send specific signals—such as pause, resume, terminate, or interrupt—to a process identified by its Process ID (PID).

---

### 🏳️ Options & Flags

`kill [options] <pid>`

| Flag/Signal            | Description                                                                   |
| ---------------------- | ----------------------------------------------------------------------------- |
| `-l`, `--list`         | List all available signal names.                                              |
| `-s`, `--signal <sig>` | Specify the signal to be sent (default is SIGTERM).                           |
| `-L`, `--table`        | List available signals in a table format.                                     |
| `-1`, `SIGHUP`         | Hang up; often used to force a process to reload its configuration.           |
| `-2`, `SIGINT`         | Interrupt; equivalent to pressing `Ctrl+C` in a terminal.                     |
| `-9`, `SIGKILL`        | Force kill; terminates the process immediately (cannot be caught or ignored). |
| `-15`, `SIGTERM`       | Terminate; the default signal that requests a process to stop gracefully.     |
| `-18`, `SIGCONT`       | Continue; resumes a stopped (paused) process.                                 |
| `-19`, `SIGSTOP`       | Stop; pauses the process execution (cannot be ignored).                       |
| `--help`               | Display a help message and exit.                                              |